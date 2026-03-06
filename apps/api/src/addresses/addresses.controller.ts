import {
    Controller, Get, Post, Patch, Delete, Body, Param,
    UseGuards, Request, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Addresses')
@Controller('addresses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AddressesController {
    constructor(private readonly addressesService: AddressesService) { }

    @Get('me')
    @ApiOperation({ summary: 'List my saved addresses' })
    findAll(@Request() req: any) {
        return this.addressesService.findAll(req.user.userId);
    }

    @Post('me')
    @ApiOperation({ summary: 'Add a new address' })
    create(@Request() req: any, @Body() dto: CreateAddressDto) {
        return this.addressesService.create(req.user.userId, dto);
    }

    @Patch('me/:id')
    @ApiOperation({ summary: 'Update an address' })
    update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateAddressDto) {
        return this.addressesService.update(req.user.userId, id, dto);
    }

    @Delete('me/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete an address' })
    remove(@Request() req: any, @Param('id') id: string) {
        return this.addressesService.remove(req.user.userId, id);
    }

    @Patch('me/:id/default')
    @ApiOperation({ summary: 'Set address as default' })
    setDefault(@Request() req: any, @Param('id') id: string) {
        return this.addressesService.setDefault(req.user.userId, id);
    }
}
