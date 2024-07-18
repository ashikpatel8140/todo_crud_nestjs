import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Todo, User]), AuthModule,
  
  JwtModule.register({
    secret: new Buffer(process.env.jwt_secret, 'base64'),
    signOptions: { algorithm: 'HS512' }})],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule { }
