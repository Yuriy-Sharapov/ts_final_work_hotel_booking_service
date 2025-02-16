import { Controller, Get, Request, Param, Query } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomDocument } from './rooms.schema';
import { ISearchRoomsParams } from './interfaces/search.rooms.params';
import { IParamId, Role } from 'src/types';
import { IParamUser } from 'src/users/interfaces/IParamUser';

@Controller('/api/common/hotel-rooms/')
export class RoomsCommonController {
  constructor(private readonly roomsService: RoomsService) {}

  // 2.1.1 Основной API для поиска номеров
  @Get()
  async getMany(
    @Request() { user }: IParamUser,
    @Query() params: ISearchRoomsParams,
  ): Promise<RoomDocument[]> {
    // Если пользователь не аутентифицирован или его роль client, то при поиске всегда должен использоваться флаг isEnabled: true
    if (user && user.role != Role.client) {
      params.isEnabled = false;
    } else {
      params.isEnabled = true;
    }

    return this.roomsService.search(params);
  }

  // 2.1.2 Получение подробной информации о номере
  @Get(':id')
  async getOne(@Param() { id }: IParamId): Promise<RoomDocument> {
    return this.roomsService.findById(id);
  }
}
