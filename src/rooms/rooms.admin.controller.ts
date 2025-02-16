import {
  Controller,
  Request,
  Post,
  Put,
  Body,
  HttpException,
  HttpStatus,
  Param,
  UploadedFiles,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { Room, RoomDocument } from './rooms.schema';
import { IParamId, Role } from 'src/types';
import { IParamUser } from 'src/users/interfaces/IParamUser';

@Controller('/api/admin/hotel-rooms/')
export class RoomsAdminController {
  constructor(private readonly roomsService: RoomsService) {}

  // 2.1.6 Добавление номера гостиницы администратором
  @Post('file')
  async create(
    @Request() { user }: IParamUser,
    @Body() body: Partial<Room>,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<RoomDocument> {
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

    files.forEach((file) => {
      body.images.push(file.filename);
    });

    return this.roomsService.create(body);
  }

  // 2.1.7 Изменение описания номера гостиницы администратором
  @Put(':id')
  async update(
    @Request() { user }: IParamUser,
    @Param() { id }: IParamId,
    @Body() body: Partial<Room>,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<RoomDocument> {
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

    // Список файлов из Multer нужно объединить со списком, который пришёл в body
    files.forEach((file) => {
      body.images.push(file.filename);
    });

    return this.roomsService.update(id, body);
  }
}
