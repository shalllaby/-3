import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum KuwaitGov {
    ASIMAH = 'ASIMAH',
    HAWALLI = 'HAWALLI',
    FARWANIYA = 'FARWANIYA',
    JAHRA = 'JAHRA',
    MUBARAK_AL_KABEER = 'MUBARAK_AL_KABEER',
    AHMADI = 'AHMADI',
}

export class CreateAddressDto {
    @ApiProperty({ example: 'محمد أحمد' })
    @IsString()
    fullName: string;

    @ApiProperty({ example: '+96550000001' })
    @IsString()
    phone: string;

    @ApiPropertyOptional({ example: '5' })
    @IsOptional()
    @IsString()
    block?: string;

    @ApiProperty({ example: 'شارع الخليج العربي' })
    @IsString()
    street: string;

    @ApiPropertyOptional({ example: '12' })
    @IsOptional()
    @IsString()
    building?: string;

    @ApiPropertyOptional({ example: '3' })
    @IsOptional()
    @IsString()
    floor?: string;

    @ApiPropertyOptional({ example: '7' })
    @IsOptional()
    @IsString()
    apartment?: string;

    @ApiProperty({ example: 'الشويخ' })
    @IsString()
    area: string;

    @ApiProperty({ enum: KuwaitGov })
    @IsEnum(KuwaitGov)
    governorate: KuwaitGov;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    deliveryNotes?: string;

    @ApiPropertyOptional({ default: false })
    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;
}
