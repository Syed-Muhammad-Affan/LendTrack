import jwt from 'jsonwebtoken';
import { config } from '../../config/config.js';
import {
  ITokenPayload,
  ITokenService,
} from './interface/token.service.interface.js';

export class JwtTokenService implements ITokenService {
  sign(payload: ITokenPayload): string {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.lifetime,
    });
  }
}
