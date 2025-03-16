import {
  Controller,
  Post,
  Put,
  Body,
  Param,
  UploadedFiles,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { Room, RoomDocument } from './rooms.schema';
import { IParamId, Role } from 'src/types';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('/api/admin/hotel-rooms/')
@SetMetadata('roles', [Role.admin]) // Запуска методы текущего класса может только Admin
@UseGuards(AuthGuard) // Профиль пользователя под защитой JWT-токена
export class RoomsAdminController {
  constructor(private readonly roomsService: RoomsService) {}

  // 2.1.6 Добавление номера гостиницы администратором
  @Post('file')
  async create(
    @Body() body: Partial<Room>,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<RoomDocument> {
    files.forEach((file) => {
      body.images.push(file.filename);
    });

    return this.roomsService.create(body);
  }

  // 2.1.7 Изменение описания номера гостиницы администратором
  @Put(':id')
  async update(
    @Param() { id }: IParamId,
    @Body() body: Partial<Room>,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<RoomDocument> {
    // Список файлов из Multer нужно объединить со списком, который пришёл в body
    files.forEach((file) => {
      body.images.push(file.filename);
    });

    return this.roomsService.update(id, body);
  }
}
