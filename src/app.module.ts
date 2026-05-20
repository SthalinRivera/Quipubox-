import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './usuarios/users.module';
import { AuthModule } from './auth/auth.module';
import { SedesModule } from './sedes/sedes.module';



@Module({
  imports: [UsersModule, AuthModule, SedesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }