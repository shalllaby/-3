import {
    Controller, Get, Post, Patch, Delete, Body, Param,
    UseGuards, Query, UploadedFiles, UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsQueryDto } from './dto/products-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

const imageStorage = diskStorage({
    destination: './uploads/products',
    filename: (_, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
    },
});

@ApiTags('Products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    // ── Public endpoints ─────────────────────────────────────────
    @Get()
    @ApiOperation({ summary: 'List products with search, filter, sort, pagination' })
    findAll(@Query() query: ProductsQueryDto) {
        return this.productsService.findAll(query);
    }

    @Get('low-stock')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    @ApiOperation({ summary: '[Admin] Get low-stock products' })
    getLowStock(@Query('threshold') threshold?: number) {
        return this.productsService.getLowStock(threshold);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get product by ID (also increments view count)' })
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    // ── Admin-only endpoints ─────────────────────────────────────
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    @ApiOperation({ summary: '[Admin] Create product' })
    create(@Body() dto: CreateProductDto) {
        return this.productsService.create(dto);
    }

    @Post(':id/images')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FilesInterceptor('images', 10, { storage: imageStorage }))
    @ApiOperation({ summary: '[Admin] Upload product images (max 10)' })
    async uploadImages(
        @Param('id') id: string,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        const imageUrls = files.map((f) => `/uploads/products/${f.filename}`);
        const product = await this.productsService.findOne(id);
        return this.productsService.update(id, {
            images: [...(product.images || []), ...imageUrls],
        });
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    @ApiOperation({ summary: '[Admin] Update product' })
    update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
        return this.productsService.update(id, dto);
    }

    @Patch(':id/toggle-active')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    @ApiOperation({ summary: '[Admin] Toggle product visibility' })
    toggleActive(@Param('id') id: string) {
        return this.productsService.toggleActive(id);
    }

    @Patch(':id/stock')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    @ApiOperation({ summary: '[Admin] Update stock quantity' })
    updateStock(@Param('id') id: string, @Body('quantity') quantity: number) {
        return this.productsService.updateStock(id, quantity);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    @ApiOperation({ summary: '[Admin] Delete product' })
    remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }
}
