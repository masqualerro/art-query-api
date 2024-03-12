import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { LoginDto } from './login-dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() loginDto: LoginDto) {
    return this.authService.signIn(loginDto.email, loginDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @Get('is-token-expired')
  async isTokenExpired(@Request() req) {
    const isTokenExpired = await this.authService.isTokenExpired(
      req.headers.authorization,
    );
    if (isTokenExpired) {
      return { expired: isTokenExpired, message: 'Token is expired' };
    } else {
      return { expired: isTokenExpired, message: 'Token is active' };
    }
  }
}
