import { IsString, IsEnum, IsArray, ValidateNested, IsUUID, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class PackageItemDto {
    @ApiProperty()
    @IsUUID()
    productId: string;

    @ApiProperty({ minimum: 1, maximum: 99 })
    @IsInt()
    @Min(1)
    @Max(99)
    quantity: number;
}

export class CreatePackageDto {
    @ApiProperty({ example: 'باقتي المنزلية' })
    @IsString()
    nameAr: string;

    @ApiProperty({ enum: ['HOME', 'WORK', 'CUSTOM'] })
    @IsEnum(['HOME', 'WORK', 'CUSTOM'])
    type: 'HOME' | 'WORK' | 'CUSTOM';

    @ApiProperty({ type: [PackageItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PackageItemDto)
    items: PackageItemDto[];
}
