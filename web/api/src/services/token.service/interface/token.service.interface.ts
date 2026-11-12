export interface ITokenPayload {
  id: string;
  name: string;
}

export interface ITokenService {
  sign(payload: ITokenPayload): string;
}
