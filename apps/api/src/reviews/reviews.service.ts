import {
    Injectable, NotFoundException, ForbiddenException, ConflictException, BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

export interface RatingSummary {
    average: number;
    total: number;
    distribution: Record<1 | 2 | 3 | 4 | 5, number>;
    /**
     * Exposes fields needed to update a future denormalized `ratingAvg` / `ratingCount`
     * on the Product model without any service refactoring.
     * Caller (e.g. an event listener or admin job) can read these directly.
     */
    _forDenormalization: { productId: string; average: number; total: number };
}

@Injectable()
export class ReviewsService {
    constructor(private readonly prisma: PrismaService) { }

    /** List all reviews for a product (public) */
    async findByProduct(productId: string) {
        const product = await this.prisma.product.findUnique({ where: { id: productId } });
        if (!product) throw new NotFoundException('المنتج غير موجود');

        return this.prisma.review.findMany({
            where: { productId },
            include: {
                user: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Aggregated rating summary for a product.
     * Calculated live via Prisma aggregate — no denormalization overhead at this scale.
     * Structured so callers can read `_forDenormalization` to later propagate to Product
     * without any service-level refactoring.
     */
    async getRatingSummary(productId: string): Promise<RatingSummary> {
        const [agg, byRating] = await Promise.all([
            this.prisma.review.aggregate({
                where: { productId },
                _avg: { rating: true },
                _count: { rating: true },
            }),
            this.prisma.review.groupBy({
                by: ['rating'],
                where: { productId },
                _count: { rating: true },
            }),
        ]);

        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<1 | 2 | 3 | 4 | 5, number>;
        for (const row of byRating) {
            distribution[row.rating as 1 | 2 | 3 | 4 | 5] = row._count.rating;
        }

        const average = Number((agg._avg.rating ?? 0).toFixed(1));
        const total = agg._count.rating;

        return {
            average,
            total,
            distribution,
            _forDenormalization: { productId, average, total },
        };
    }

    /**
     * Create a review.
     * Only verified purchasers (user has an OrderItem for this product) can submit.
     * One review per user per product enforced by DB @@unique constraint.
     */
    async create(userId: string, productId: string, dto: CreateReviewDto) {
        const product = await this.prisma.product.findUnique({ where: { id: productId } });
        if (!product) throw new NotFoundException('المنتج غير موجود');

        // Verify purchaser: check if user has any order with this productId
        const purchaseRecord = await this.prisma.orderItem.findFirst({
            where: {
                productId,
                order: { userId, status: { in: ['DELIVERED', 'PAID', 'SHIPPED', 'PROCESSING'] } },
            },
        });

        if (!purchaseRecord) {
            throw new ForbiddenException('يمكن فقط للمشترين الذين استلموا المنتج كتابة التقييم');
        }

        try {
            return await this.prisma.review.create({
                data: {
                    productId,
                    userId,
                    rating: dto.rating,
                    body: dto.body,
                    isVerified: true,
                },
                include: {
                    user: { select: { id: true, name: true } },
                },
            });
        } catch (e: any) {
            // Prisma unique constraint violation = user already reviewed this product
            if (e?.code === 'P2002') {
                throw new ConflictException('لقد قمت بتقييم هذا المنتج من قبل');
            }
            throw e;
        }
    }

    /** Delete a review — author or ADMIN only */
    async remove(userId: string, reviewId: string, role: string) {
        const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
        if (!review) throw new NotFoundException('التقييم غير موجود');

        if (review.userId !== userId && role !== 'ADMIN') {
            throw new ForbiddenException('غير مصرح بحذف هذا التقييم');
        }

        await this.prisma.review.delete({ where: { id: reviewId } });
        return { message: 'تم حذف التقييم بنجاح' };
    }
}
