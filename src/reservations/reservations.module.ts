import { Module } from '@nestjs/common';

import { UsersModule } from 'src/users/users.module';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';

import { HotelsModule } from 'src/hotels/hotels.module';
import { HotelsController } from 'src/hotels/hotels.admin.controller';
import { HotelsService } from 'src/hotels/hotels.service';

import { RoomsModule } from 'src/rooms/rooms.module';
import { RoomsController } from 'src/rooms/rooms.controller';
import { RoomsService } from 'src/rooms/rooms.service';

@Module({
  imports: [UsersModule, HotelsModule, RoomsModule],
  controllers: [UsersController, RoomsController, HotelsController],
  providers: [UsersService, HotelsService, RoomsService],
})
export class ReservationsModule {}
