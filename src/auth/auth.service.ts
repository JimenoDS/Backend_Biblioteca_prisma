import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaUsuariosService } from 'src/prisma/prisma-usuarios.service'; // <--- CAMBIO
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';


@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaUsuariosService, // <--- CAMBIO: Inyectamos el servicio específico
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
      include: { rol: true } 
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas (Email)');
    }

    const isPasswordValid = await bcrypt.compare(password, usuario.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas (Password)');
    }

    const payload = { 
      sub: usuario.id_usuario, 
      email: usuario.email, 
      rol: usuario.rol.nombre_rol 
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}