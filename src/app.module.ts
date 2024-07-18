import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodosModule } from './modules/todos/todos.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmConfigModule } from 'ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // Import and use ormconfig
    TypeOrmModule.forRoot(TypeOrmConfigModule),
    TodosModule, AuthModule, // Register the TodoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
