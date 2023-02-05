import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() userCredentials: AuthDto) {
    console.log(userCredentials);
    return this.authService.signup(userCredentials);
  }

  @Post('signin')
  signin(@Body() userCredentials: AuthDto) {
    return this.authService.signin(userCredentials);
  }
}
