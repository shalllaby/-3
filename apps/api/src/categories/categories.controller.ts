import {
    Controller, Get, Post, Patch, Delete, Body, Param,
    UseGuards, Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    // ── Public endpoints ─────────────────────────────────────────
    @Get()
    @ApiOperation({ summary: 'Get all categories (nested tree)' })
    findAll() {
        return this.categoriesService.findAll();
    }

    @Get('flat')
    @ApiOperation({ summary: 'Get flat list for admin dropdowns' })
    findAllFlat() {
        return this.categoriesService.findAllFlat();
    }

    @Get(':slug/slug')
    @ApiOperation({ summary: 'Get category by slug with products' })
    findBySlug(@Param('slug') slug: string) {
        return this.categoriesService.findBySlug(slug);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.categoriesService.findOne(id);
    }

    // ── Admin-only endpoints ─────────────────────────────────────
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    @ApiOperation({ summary: '[Admin] Create category' })
    create(@Body() dto: CreateCategoryDto) {
        return this.categoriesService.create(dto);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    @ApiOperation({ summary: '[Admin] Update category' })
    update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
        return this.categoriesService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    @ApiOperation({ summary: '[Admin] Delete category' })
    remove(@Param('id') id: string) {
        return this.categoriesService.remove(id);
    }
}
