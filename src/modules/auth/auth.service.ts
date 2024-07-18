import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    const newUser = this.userRepository.create(createUserDto);
    newUser.password = await this.hashPassword(createUserDto.password);
    return await this.userRepository.save(newUser);
  }

  async login(createUserDto: CreateUserDto): Promise<{ token: string } | undefined> {
    const user = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (!user) {
      throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED); // More generic error message for better security
    }

    const isPasswordMatch = await this.comparePassword(createUserDto.password, user.password);
    if (!isPasswordMatch) {
      throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED); // More generic error message for better security
    }

    const token = await this.jwtService.sign({ userId: user.id });
    return { token };
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Adjust salt rounds as needed
    return await bcrypt.hash(password, saltRounds);
  }

  private async comparePassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }
}
