import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { UsersClientController } from './users/users.client.controller';
import { UsersService } from './users/users.service';

import { HotelsModule } from './hotels/hotels.module';
import { UsersAuthController } from './users/users.auth.controller';
import { HotelsAdminController } from './hotels/hotels.admin.controller';
import { HotelsService } from './hotels/hotels.service';

import { RoomsModule } from './rooms/rooms.module';
import { RoomsAdminController } from './rooms/rooms.admin.controller';
import { RoomsCommonController } from './rooms/rooms.common.controller';
import { RoomsService } from './rooms/rooms.service';

import { ReservationsModule } from './reservations/reservations.module';
import { ReservationsClientController } from './reservations/reservations.client.controller';
import { ReservationsManagerController } from './reservations/reservations.manager.controller';
import { ReservationsService } from './reservations/reservations.service';

import { SupportRequestsService } from './support.requests/support.requests.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersAdminController } from './users/users.Admin.controller';
import { UsersManagerController } from './users/users.manager.controller';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URL),
    UsersModule,
    HotelsModule,
    RoomsModule,
    ReservationsModule,
  ],
  controllers: [
    AppController,
    UsersAuthController,
    UsersAdminController,
    UsersManagerController,
    UsersClientController,
    HotelsAdminController,
    RoomsAdminController,
    RoomsCommonController,
    ReservationsClientController,
    ReservationsManagerController,
  ],
  providers: [
    AppService,
    AuthService,
    UsersService,
    HotelsService,
    RoomsService,
    ReservationsService,
    SupportRequestsService,
  ],
})
export class AppModule {}
