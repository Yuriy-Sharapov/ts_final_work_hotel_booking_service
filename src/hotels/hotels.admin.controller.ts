import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { Hotel, HotelDocument } from './hotels.schema';
import { ISearchHotelParams } from './interfaces/search.hotel.params';
import { IParamId, Role } from 'src/types';
import { IUpdateHotelParams } from './interfaces/update.hotel.params';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('/api/admin/hotels/')
@SetMetadata('roles', [Role.admin]) // Запускать методы текущего класса может только Admin
@UseGuards(AuthGuard) // Профиль пользователя под защитой JWT-токена
export class HotelsAdminController {
  constructor(private readonly hotelsService: HotelsService) {}

  // 2.1.3 Добавление гостиницы администратором
  @Post()
  async create(@Body() body: Partial<Hotel>): Promise<HotelDocument> {
    return this.hotelsService.create(body);
  }

  // 2.1.4 Получение списка гостиниц администратором
  @Get()
  async search(@Query() params: ISearchHotelParams): Promise<HotelDocument[]> {
    return this.hotelsService.search(params);
  }

  // 2.1.5 Изменение описания гостиницы администратором
  @Put(':id')
  async update(
    @Param() { id }: IParamId,
    @Body() body: IUpdateHotelParams,
  ): Promise<HotelDocument> {
    return this.hotelsService.update(id, body);
  }
}
