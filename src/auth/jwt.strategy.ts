import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secreto_super_seguro',
    });
  }

  async validate(payload: any) {
    // Esto es lo que tendrás disponible en req.user en tus controladores
    return { 
      id_usuario: payload.sub,  // <--- Cambiado de id_estudiante a id_usuario
      email: payload.email, 
      rol: payload.rol 
    };
  }
}