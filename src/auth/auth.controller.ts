import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';

import { JwtAuthGuard }
  from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService,
  ) { }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req) {
    return this.authService.getProfile(req.user);
  }
}