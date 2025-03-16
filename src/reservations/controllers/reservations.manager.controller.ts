import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
  Delete,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { ReservationsService } from '../reservations.service';
import { ReservationDocument } from '../reservations.schema';
import { IParamId, Role } from 'src/types';
import { IReservationSearchOptions } from '../interfaces/reservation.search.options';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('/api/manager/reservations/')
@SetMetadata('roles', [Role.manager])     // Запускать методы текущего класса может только Manager
@UseGuards(AuthGuard)                     // Профиль пользователя под защитой JWT-токена
export class ReservationsManagerController {
  constructor(private readonly reservationsService: ReservationsService) {}

  // 2.2.4. Список броней конкретного пользователя
  @Get(':id')
  async getReservsByClient(
    @Param() { id }: IParamId,
  ): Promise<ReservationDocument[]> {
    let params: IReservationSearchOptions;
    params.userId = id;

    return this.reservationsService.getReservations(params);
  }

  // 2.2.5 Отменяет бронь пользователя по id брони
  @Delete(':id')
  async deleteReserv(@Param() { id }: IParamId): Promise<void> {
    const reservation = await this.reservationsService.findById(id);

    if (!reservation)
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST, // 400
          error: 'Брони с указанным ID не существует',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: 'Брони с указанным ID не существует',
        },
      );

    this.reservationsService.removeReservation(id);
  }
}
