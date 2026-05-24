import { Module } from '@nestjs/common'
import { EvidenciasModule } from './evidencias/evidencias.module';

import { ConfigModule }
  from '@nestjs/config'

import { AppController }
  from './app.controller'

import { AppService }
  from './app.service'

import { UsersModule }
  from './usuarios/users.module'

import { AuthModule }
  from './auth/auth.module'





@Module({

  imports: [

    ConfigModule.forRoot({

      isGlobal: true,

    }),

    UsersModule,
    EvidenciasModule,
    AuthModule,

  ],

  controllers: [
    AppController,
  ],

  providers: [
    AppService,
  ],
})
export class AppModule { }