import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { Hotel, HotelDocument } from './hotels.schema';
import { ISearchHotelParams } from './interfaces/search.hotel.params';
import { IParamUser } from 'src/users/interfaces/IParamUser';
import { IParamId, Role } from 'src/types';
import { IUpdateHotelParams } from './interfaces/update.hotel.params';

@Controller('/api/admin/hotels/')
export class HotelsAdminController {
  constructor(private readonly hotelsService: HotelsService) {}

  // 2.1.3 Добавление гостиницы администратором
  @Post()
  async create(
    @Request() { user }: IParamUser,
    @Body() body: Partial<Hotel>,
  ): Promise<HotelDocument> {
    if (!user)
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED, // 401
          error: 'Пользователь не аутентифицирован',
        },
        HttpStatus.UNAUTHORIZED,
        {
          cause: 'Пользователь не аутентифицирован',
        },
      );

    if (user.role != Role.admin)
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN, // 403
          error: 'Роль пользователя не admin',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: 'Роль пользователя не admin',
        },
      );

    return this.hotelsService.create(body);
  }

  // 2.1.4 Получение списка гостиниц администратором
  @Get()
  async search(
    @Request() { user }: IParamUser,
    @Query() params: ISearchHotelParams,
  ): Promise<HotelDocument[]> {
    if (!user)
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED, // 401
          error: 'Пользователь не аутентифицирован',
        },
        HttpStatus.UNAUTHORIZED,
        {
          cause: 'Пользователь не аутентифицирован',
        },
      );

    if (user.role != Role.admin)
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN, // 403
          error: 'Роль пользователя не admin',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: 'Роль пользователя не admin',
        },
      );

    return this.hotelsService.search(params);
  }

  // 2.1.5 Изменение описания гостиницы администратором
  @Put(':id')
  async update(
    @Request() { user }: IParamUser,
    @Param() { id }: IParamId,
    @Body() body: IUpdateHotelParams,
  ): Promise<HotelDocument> {
    if (!user)
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED, // 401
          error: 'Пользователь не аутентифицирован',
        },
        HttpStatus.UNAUTHORIZED,
        {
          cause: 'Пользователь не аутентифицирован',
        },
      );

    if (user.role != Role.admin)
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN, // 403
          error: 'Роль пользователя не admin',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: 'Роль пользователя не admin',
        },
      );

    return this.hotelsService.update(id, body);
  }
}
