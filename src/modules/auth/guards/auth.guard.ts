import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UserAuthGuard extends AuthGuard('access-token') {
  constructor(private readonly jwtService: JwtService) {
    super(jwtService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean | any> {
    const request = context.switchToHttp().getRequest();

    // Validate Authorization header presence and format
    if (!request.headers || !request.headers.authorization) {
      throw new HttpException(
        { error: 'missing_authorization_header', message: 'Authorization header is missing' },
        HttpStatus.UNAUTHORIZED
      );
    }

    const parts = request.headers.authorization.split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      throw new HttpException(
        { error: 'invalid_authorization_format', message: 'Invalid authorization format (expected Bearer token)' },
        HttpStatus.UNAUTHORIZED
      );
    }

    const token = parts[1];

    // Validate token presence and format
    if (!token) {
      throw new HttpException(
        { error: 'missing_access_token', message: 'Missing access token' },
        HttpStatus.UNAUTHORIZED
      );
    }

    try {
      // Attempt JWT verification and decode
      const decodedUser = this.jwtService.verify(token);
      request['user'] = decodedUser;
      return true; // Return decoded user details if successful
    } catch (err) {
      // Handle JWT verification errors with specific messages
      if (err.name === 'JsonWebTokenError') {
        if (err.message.includes('invalid signature')) {
          throw new HttpException(
            { error: 'invalid_signature', message: 'Invalid signature in access token' },
            HttpStatus.UNAUTHORIZED
          );
        } else if (err.message.includes('expired')) {
          throw new HttpException(
            { error: 'expired_access_token', message: 'Access token has expired' },
            HttpStatus.UNAUTHORIZED
          );
        } else {
          // Handle other JWT verification errors (e.g., malformed token)
          throw new HttpException(
            { error: 'invalid_access_token', message: 'Invalid access token' },
            HttpStatus.UNAUTHORIZED
          );
        }
      } else {
        // Handle unexpected errors during verification
        throw new HttpException(
          { error: 'internal_server_error', message: 'Internal server error' },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }
}
