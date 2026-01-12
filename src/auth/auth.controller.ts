import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UseGuards, Get, Request } from '@nestjs/common';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')            // 1. Define la ruta GET /auth/profile
  @UseGuards(JwtAuthGuard)   // 2. Protege la ruta: "¡Alto! Solo pasas si tienes token válido"
  getProfile(@Request() req) { 
    return req.user;         // 3. Devuelve los datos del usuario extraídos del token
  }

}