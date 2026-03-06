import {
    Controller, Get, Post, Patch, Delete, Body, Param,
    UseGuards, Request, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Packages')
@Controller('packages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PackagesController {
    constructor(private readonly packagesService: PackagesService) { }

    @Get('me')
    @ApiOperation({ summary: 'List my saved monthly boxes' })
    findMy(@Request() req: any) {
        return this.packagesService.findMy(req.user.userId);
    }

    @Post('me')
    @ApiOperation({ summary: 'Save a new monthly box' })
    create(@Request() req: any, @Body() dto: CreatePackageDto) {
        return this.packagesService.create(req.user.userId, dto);
    }

    @Patch('me/:id')
    @ApiOperation({ summary: 'Update box name, items, or status (pause/resume)' })
    update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdatePackageDto) {
        return this.packagesService.update(req.user.userId, id, dto);
    }

    @Patch('me/:id/toggle')
    @ApiOperation({ summary: 'Toggle box status between ACTIVE and PAUSED' })
    toggle(@Request() req: any, @Param('id') id: string) {
        return this.packagesService.toggle(req.user.userId, id);
    }

    @Delete('me/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete a saved box' })
    remove(@Request() req: any, @Param('id') id: string) {
        return this.packagesService.remove(req.user.userId, id);
    }

    @Post('me/:id/reorder')
    @ApiOperation({ summary: 'Instantly reorder a saved box as a new order' })
    reorder(
        @Request() req: any,
        @Param('id') id: string,
        @Body() body: { paymentMethod: any; addressId?: string; shippingFee?: number },
    ) {
        return this.packagesService.reorder(req.user.userId, id, body);
    }
}
