import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { CreatePackageDto } from './create-package.dto';

export class UpdatePackageDto extends PartialType(CreatePackageDto) {
    @IsOptional()
    @IsEnum(['ACTIVE', 'PAUSED'])
    status?: 'ACTIVE' | 'PAUSED';
}
