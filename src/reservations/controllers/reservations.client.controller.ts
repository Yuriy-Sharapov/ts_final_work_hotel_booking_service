import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { IParamUser } from 'src/users/interfaces/IParamUser';
import { ReservationDocument } from '../reservations.schema';
import { ReservationsService } from '../reservations.service';
import { IReservationDto } from '../interfaces/reservation.dto';
import { IParamId, Role } from 'src/types';
import { IReservationSearchOptions } from '../interfaces/reservation.search.options';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('/api/client/reservations/')
@SetMetadata('roles', [Role.client]) // Запускать методы текущего класса может только Client
@UseGuards(AuthGuard) // Профиль пользователя под защитой JWT-токена
export class ReservationsClientController {
  constructor(private readonly reservationsService: ReservationsService) {}

  // 2.2.1. Создаёт бронь на номер на выбранную дату для текущего пользователя.
  @Post()
  async create(@Body() body: IReservationDto): Promise<ReservationDocument> {
    const reservation = this.reservationsService.addReservation(body);
    if (!reservation)
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST, // 400
          error: 'Номера с указанным ID не существует или он забронирован',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: 'Номера с указанным ID не существует или он забронирован',
        },
      );

    return reservation;
  }

  // 2.2.2 Список броней текущего пользователя
  @Get()
  async searchReservs(
    @Query() params: IReservationSearchOptions,
  ): Promise<ReservationDocument[]> {
    return this.reservationsService.getReservations(params);
  }

  // 2.2.3 Отмена бронирования клиентом
  @Delete(':id')
  async deleteReserv(
    @Request() { user }: IParamUser,
    @Param() { id }: IParamId,
  ): Promise<void> {
    const reservation = await this.reservationsService.findById(id);

    if (!reservation)
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST, // 400
          error: 'Бронь с указанным ID не существует',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: 'Бронь с указанным ID не существует',
        },
      );

    if (user.id != reservation.userId)
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN, // 403
          error:
            'ID текущего пользователя не совпадает с ID пользователя в брони',
        },
        HttpStatus.FORBIDDEN,
        {
          cause:
            'ID текущего пользователя не совпадает с ID пользователя в брони',
        },
      );

    this.reservationsService.removeReservation(id);
  }
}
