import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  
  @Post("create")
  @UsePipes(ValidationPipe)
  async create(@Body() createUserDto: CreateUserDto): Promise<any> {
    return await this.authService.create(createUserDto);
  }

  @Post("login")
  @UsePipes(ValidationPipe)
  async login(@Body() createUserDto: CreateUserDto): Promise<any> {
    return await this.authService.login(createUserDto);
  }
}
