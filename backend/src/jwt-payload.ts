export interface JwtPayload {
  id: string;
  name: string;
  email: string;
  iat?: number;
}
