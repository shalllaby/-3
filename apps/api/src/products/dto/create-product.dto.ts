import {
    IsString, IsOptional, IsBoolean, IsUUID, IsArray,
    IsNumber, Min, IsDecimal, IsPositive,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateProductDto {
    @ApiProperty({ example: 'مسحوق غسيل برسيل' })
    @IsString()
    nameAr: string;

    @ApiProperty({ example: 'Persil Washing Powder' })
    @IsString()
    nameEn: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    descriptionAr?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    descriptionEn?: string;

    @ApiProperty({ example: 'PERS-5KG-001' })
    @IsString()
    sku: string;

    @ApiProperty({ example: '49.99' })
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    price: number;

    @ApiProperty({ example: '39.99', required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    discountPrice?: number;

    @ApiProperty({ example: 100 })
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    stockQuantity: number;

    @ApiProperty({ example: 5.0, required: false, description: 'Weight in KG (for shipping calc)' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    weightKg?: number;

    @ApiProperty({ type: [String], required: false })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];

    @ApiProperty()
    @IsUUID()
    categoryId: string;

    @ApiProperty({ required: false, default: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiProperty({ required: false, default: false })
    @IsOptional()
    @IsBoolean()
    isFeatured?: boolean;
}
