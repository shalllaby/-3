import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: 'أحمد العتيبي' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'ahmed@example.com' })
    @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
    email: string;

    @ApiProperty({ example: 'SecurePass123!' })
    @IsString()
    @MinLength(8, { message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' })
    password: string;

    @ApiPropertyOptional({ example: 'AHD-A1B2C3', description: 'رمز الإحالة الخاص بالمُحيل (اختياري)' })
    @IsOptional()
    @IsString()
    referralCode?: string;
}
