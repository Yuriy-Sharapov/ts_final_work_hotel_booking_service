import { Module } from '@nestjs/common';

import { UsersModule } from 'src/users/users.module';
import { UsersAdminController } from 'src/users/controllers/users.admin.controller';
import { UsersService } from 'src/users/users.service';

import { HotelsModule } from 'src/hotels/hotels.module';
import { HotelsAdminController } from 'src/hotels/hotels.admin.controller';
import { HotelsService } from 'src/hotels/hotels.service';

import { RoomsModule } from 'src/rooms/rooms.module';
import { RoomsAdminController } from 'src/rooms/controllers/rooms.admin.controller';
import { RoomsCommonController } from 'src/rooms/controllers/rooms.common.controller';
import { RoomsService } from 'src/rooms/rooms.service';

@Module({
  imports: [UsersModule, HotelsModule, RoomsModule],
  controllers: [
    UsersAdminController,
    RoomsAdminController,
    RoomsCommonController,
    HotelsAdminController,
  ],
  providers: [UsersService, HotelsService, RoomsService],
})
export class ReservationsModule {}
