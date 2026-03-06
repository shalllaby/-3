import {
    Controller, Get, Post, Delete, Body, Param,
    UseGuards, Request, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Reviews')
@Controller()
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    // ── Public: read reviews ──────────────────────────────────────────

    @Get('products/:productId/reviews')
    @ApiOperation({ summary: 'List all reviews for a product' })
    findByProduct(@Param('productId') productId: string) {
        return this.reviewsService.findByProduct(productId);
    }

    @Get('products/:productId/reviews/summary')
    @ApiOperation({ summary: 'Get rating summary (avg, distribution) for a product' })
    getSummary(@Param('productId') productId: string) {
        return this.reviewsService.getRatingSummary(productId);
    }

    // ── Auth: create / delete ─────────────────────────────────────────

    @Post('products/:productId/reviews')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Submit a review (verified purchasers only)' })
    create(
        @Request() req: any,
        @Param('productId') productId: string,
        @Body() dto: CreateReviewDto,
    ) {
        return this.reviewsService.create(req.user.userId, productId, dto);
    }

    @Delete('reviews/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete a review (author or admin)' })
    remove(@Request() req: any, @Param('id') id: string) {
        return this.reviewsService.remove(req.user.userId, id, req.user.role);
    }
}
