import { AuthResponse } from './authResponse.interface.js';
import { ILoginDTO } from './loginDTO.interface.js';
import { IRegisterDTO } from './registerDTO.interface.js';

export interface IAuthService {
  register(data: IRegisterDTO): Promise<AuthResponse>;
  login(data: ILoginDTO): Promise<AuthResponse>;
}
