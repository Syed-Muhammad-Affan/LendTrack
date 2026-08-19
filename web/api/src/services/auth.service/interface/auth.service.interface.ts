import { Response } from 'express';
import { AuthResponse } from './authResponse.interface.js';
import { ILoginDTO } from './loginDTO.interface.js';
import { IRegisterDTO } from './registerDTO.interface.js';
import { IGenericResponse } from './genericResponse.interface.js';

export interface IAuthService {
  register(data: IRegisterDTO): Promise<AuthResponse>;
  login(data: ILoginDTO): Promise<AuthResponse>;
  forgotPassword(email: string): Promise<IGenericResponse>;
  resetPassword(token: string, newPassword: string): Promise<void>;
}
