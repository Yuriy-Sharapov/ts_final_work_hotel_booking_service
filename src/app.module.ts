import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { UsersClientController } from './users/controllers/users.client.controller';
import { UsersService } from './users/users.service';

import { HotelsModule } from './hotels/hotels.module';
import { UsersAuthController } from './users/controllers/users.auth.controller';
import { HotelsAdminController } from './hotels/hotels.admin.controller';
import { HotelsService } from './hotels/hotels.service';

import { RoomsModule } from './rooms/rooms.module';
import { RoomsAdminController } from './rooms/controllers/rooms.admin.controller';
import { RoomsCommonController } from './rooms/controllers/rooms.common.controller';
import { RoomsService } from './rooms/rooms.service';

import { ReservationsModule } from './reservations/reservations.module';
import { ReservationsClientController } from './reservations/controllers/reservations.client.controller';
import { ReservationsManagerController } from './reservations/controllers/reservations.manager.controller';
import { ReservationsService } from './reservations/reservations.service';

import { SupportRequestsService } from './support.requests/services/support.requests.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersAdminController } from './users/controllers/users.admin.controller';
import { UsersManagerController } from './users/controllers/users.manager.controller';
import { AuthService } from './auth/auth.service';

import { SupportRequestsGateway } from './support.requests/support.requests.gateway';

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
    SupportRequestsGateway
  ],
})
export class AppModule {}
