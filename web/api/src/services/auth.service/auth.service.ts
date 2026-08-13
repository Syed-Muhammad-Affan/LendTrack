import { BadRequest } from '../../errors/bad-request.js';
import { Unauthenticated } from '../../errors/unauthenticated.js';
import { IUserRepository } from '../../repository/interface/user.repository.interface.js';
import { IAuthService } from './interface/auth.service.interface.js';
import { AuthResponse } from './interface/authResponse.interface.js';
import { ILoginDTO } from './interface/loginDTO.interface.js';
import { IRegisterDTO } from './interface/registerDTO.interface.js';

export class AuthService implements IAuthService {
  constructor(private readonly UserRepository: IUserRepository) {}

  async register(data: IRegisterDTO): Promise<AuthResponse> {
    const user = await this.UserRepository.createUser(data);
    const token = user.createJWT();

    return {
      user: {
        id: user._id.toString(),
        username: user.name,
        email: user.email,
      },
      token,
    };
  }

  async login(data: ILoginDTO): Promise<AuthResponse> {
    const { email, password } = data;

    if (!email || !password) {
      throw new BadRequest('Please provide email and password');
    }

    const user = await this.UserRepository.getSingleUserByEmail(email);

    if (!user) {
      throw new Unauthenticated('Invalid Credential');
    }

    const isPasswordCorrect = user.comparePassword(password);

    if (!isPasswordCorrect) {
      throw new Unauthenticated('Invalid Credential');
    }

    const token = user.createJWT();

    return {
      user: {
        id: user._id.toString(),
        username: user.name,
        email: user.email,
      },
      token,
    };
  }
}
