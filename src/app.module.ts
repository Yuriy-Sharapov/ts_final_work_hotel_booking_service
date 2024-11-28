import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomsService } from './rooms/rooms.service';
import { RoomsController } from './rooms/rooms.controller';
import { RoomsModule } from './rooms/rooms.module';
import { HotelsService } from './hotels/hotels.service';
import { HotelsController } from './hotels/hotels.controller';
import { HotelsModule } from './hotels/hotels.module';
import { ReservationsService } from './reservations/reservations.service';
import { ReservationsController } from './reservations/reservations.controller';
import { ReservationsModule } from './reservations/reservations.module';
import { ChatsService } from './chats/chats.service';

@Module({
  imports: [RoomsModule, HotelsModule, ReservationsModule],
  controllers: [AppController, RoomsController, HotelsController, ReservationsController],
  providers: [AppService, RoomsService, HotelsService, ReservationsService, ChatsService],
})
export class AppModule {}
