import {
    IsString, IsOptional, IsBoolean, IsInt, Min, IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({ example: 'المطبخ' })
    @IsString()
    nameAr: string;

    @ApiProperty({ example: 'Kitchen' })
    @IsString()
    nameEn: string;

    @ApiProperty({ example: 'kitchen' })
    @IsString()
    slug: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    imageUrl?: string;

    @ApiProperty({ required: false, description: 'Parent category ID for sub-categories' })
    @IsOptional()
    @IsUUID()
    parentId?: string;

    @ApiProperty({ required: false, default: 0 })
    @IsOptional()
    @IsInt()
    @Min(0)
    sortOrder?: number;

    @ApiProperty({ required: false, default: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
