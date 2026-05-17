import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {

  constructor(private readonly appService: AppService) { }

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Get('status')
  getStatus() {
    return this.appService.getStatus();
  }

  @Get('info')
  getInfo() {
    return this.appService.getInfo();
  }
}