import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * List all categories with their children (sub-categories).
     * Top-level categories have parentId = null.
     */
    async findAll() {
        return this.prisma.category.findMany({
            where: { parentId: null },  // only root-level categories
            include: {
                children: {
                    include: { children: true }, // up to 2 levels deep
                },
                _count: { select: { products: true } },
            },
            orderBy: { sortOrder: 'asc' },
        });
    }

    /**
     * List all categories flat (for dropdowns in admin).
     */
    async findAllFlat() {
        return this.prisma.category.findMany({
            include: { _count: { select: { products: true } } },
            orderBy: [{ parentId: 'asc' }, { sortOrder: 'asc' }],
        });
    }

    async findBySlug(slug: string) {
        const cat = await this.prisma.category.findUnique({
            where: { slug },
            include: {
                children: true,
                products: {
                    where: { isActive: true },
                    orderBy: { createdAt: 'desc' },
                    take: 20,
                },
            },
        });
        if (!cat) throw new NotFoundException(`التصنيف غير موجود: ${slug}`);
        return cat;
    }

    async findOne(id: string) {
        const cat = await this.prisma.category.findUnique({ where: { id } });
        if (!cat) throw new NotFoundException('التصنيف غير موجود');
        return cat;
    }

    async create(dto: CreateCategoryDto) {
        // Verify slug uniqueness
        const existing = await this.prisma.category.findUnique({ where: { slug: dto.slug } });
        if (existing) throw new ConflictException('هذا الـ slug مستخدم بالفعل');

        // Verify parent exists if provided
        if (dto.parentId) {
            const parent = await this.prisma.category.findUnique({ where: { id: dto.parentId } });
            if (!parent) throw new NotFoundException('التصنيف الأعلى غير موجود');
        }

        return this.prisma.category.create({ data: dto });
    }

    async update(id: string, dto: UpdateCategoryDto) {
        await this.findOne(id); // throws if not found

        // Prevent a category from being its own parent
        if (dto.parentId === id) throw new ConflictException('التصنيف لا يمكن أن يكون أبًا لنفسه');

        return this.prisma.category.update({ where: { id }, data: dto });
    }

    async remove(id: string) {
        await this.findOne(id);
        // Prisma will throw a foreign key error if products exist — handle gracefully
        return this.prisma.category.delete({ where: { id } });
    }
}
