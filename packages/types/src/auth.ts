export interface LoginRequest {
  email: string;
  password: string;
  totpCode?: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'SELLER';
  organizationId: string;
  organizationName: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'SELLER';
  organizationId: string;
  iat?: number;
  exp?: number;
}
