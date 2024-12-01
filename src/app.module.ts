import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

import { HotelsModule } from './hotels/hotels.module';
import { HotelsController } from './hotels/hotels.controller';
import { HotelsService } from './hotels/hotels.service';

import { RoomsModule } from './rooms/rooms.module';
import { RoomsController } from './rooms/rooms.controller';
import { RoomsService } from './rooms/rooms.service';

import { ReservationsModule } from './reservations/reservations.module';
import { ReservationsController } from './reservations/reservations.controller';
import { ReservationsService } from './reservations/reservations.service';

import { ChatsService } from './chats/chats.service';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URL),
    UsersModule,
    HotelsModule,
    RoomsModule,
    ReservationsModule    
  ],
  controllers: [AppController, UsersController, HotelsController, RoomsController,  ReservationsController],
  providers: [AppService, UsersService, HotelsService, RoomsService, ReservationsService, ChatsService],
})
export class AppModule {}
