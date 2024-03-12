import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    pass: string,
  ): Promise<{ access_token: string; user: User }> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: user,
    };
  }

  async isTokenExpired(token: string): Promise<boolean> {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      const expirationTime = decoded['exp'] * 1000; // Expiration time is in seconds, convert to milliseconds
      const currentTime = new Date().getTime();
      return expirationTime < currentTime;
    } catch (error) {
      return true;
    }
  }
}
