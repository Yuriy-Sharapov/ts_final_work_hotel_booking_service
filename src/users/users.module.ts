import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersAuthController } from './controllers/users.auth.controller';
import { UsersClientController } from './controllers/users.client.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users.schema';
import { UsersAdminController } from './controllers/users.admin.controller';
import { UsersManagerController } from './controllers/users.manager.controller';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule), // разрешаем циклическую зависимость AuthModule -> UsersModule
  ],
  controllers: [
    UsersAuthController,
    UsersAdminController,
    UsersManagerController,
    UsersClientController,
  ],
  providers: [AuthService, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
