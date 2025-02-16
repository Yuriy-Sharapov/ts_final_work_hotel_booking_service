import { Controller, Get, Request, Param, HttpException, HttpStatus, Delete} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationDocument } from './reservations.schema';
import { IParamUser } from 'src/users/interfaces/IParamUser';
import { IParamId, Role } from 'src/types';
import { IReservationSearchOptions } from './interfaces/reservation.search.options';

@Controller('/api/manager/reservations/')
export class ReservationsManagerController {

    constructor(private readonly reservationsService: ReservationsService) {}

    // 2.2.4. Список броней конкретного пользователя
    @Get(':id')
    async get_reservs_by_client(
        @Request() { user }: IParamUser,
        @Param() { id }: IParamId,
    ): Promise<ReservationDocument[]> {
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

        if (user.role != Role.manager)
        throw new HttpException(
            {
            status: HttpStatus.FORBIDDEN, // 403
            error: 'Роль пользователя не manager',
            },
            HttpStatus.FORBIDDEN,
            {
            cause: 'Роль пользователя не manager',
            },
        );

        let params: IReservationSearchOptions
        params.userId = id

        return this.reservationsService.getReservations(params);
    }  
    
    // 2.2.5 Отменяет бронь пользователя по id брони
    @Delete(':id')
    async delete_reserv(
        @Request() { user }: IParamUser,
        @Param() { id }: IParamId,
    ): Promise<void>{

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
    
        if (user.role != Role.manager)
            throw new HttpException(
                {
                status: HttpStatus.FORBIDDEN, // 403
                error: 'Роль пользователя не manager',
                },
                HttpStatus.FORBIDDEN,
                {
                cause: 'Роль пользователя не manager',
                },
            );

        const reservation = await this.reservationsService.findById(id)

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

        this.reservationsService.removeReservation(id)
    }
}
