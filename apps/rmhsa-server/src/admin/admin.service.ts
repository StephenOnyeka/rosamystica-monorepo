import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/admin.dto';
import { adminEmail, checkPassword } from './admin.constants';

@Injectable()
export class AdminService {
  readonly adminEmail = adminEmail;

  constructor(private readonly jwtService: JwtService) {}

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;

    // The legacy route also crashes on a missing password; an empty string
    // simply fails the bcrypt comparison instead.
    if (email !== adminEmail || !(await checkPassword(password ?? ''))) {
      throw new UnauthorizedException({ error: 'Invalid credentials' });
    }

    return { token: this.jwtService.sign({ email }) };
  }

  verifyToken(token: string): { email?: string } {
    return this.jwtService.verify<{ email?: string }>(token);
  }

  logout(): { message: string } {
    // The legacy route was a simple placeholder.
    return { message: 'Logged out successfully' };
  }
}
