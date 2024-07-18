import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, UseGuards, Req } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto, UpdateTodoDto } from '../../modules/todos/dto/todo.dto';
import { Todo } from '../../modules/todos/entities/todo.entity';
import { UserAuthGuard } from '../auth/guards/auth.guard';
import { User } from '../auth/entities/user.entity';

@UseGuards(UserAuthGuard)
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}
  
  @Get()
  async findAll(@Req() req: any): Promise<Todo[]> {
    const userId = req.user.userId;
    return await this.todosService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Req() req: any): Promise<Todo> {
    const userId = req.user.userId;
    return await this.todosService.findOne(userId, id);
  }

  @Post()
  @UsePipes(ValidationPipe) // Apply validation pipeline
  async create(@Body() createTodoDto: CreateTodoDto, @Req() req: any): Promise<Todo> {
    const userId = req.user.userId;
    return await this.todosService.create(userId,createTodoDto);
  }

  @Put(':id')
  @UsePipes(ValidationPipe) // Apply validation pipeline
  async update(@Param('id') id: number, @Body() updateTodoDto: UpdateTodoDto, @Req() req: any): Promise<Todo | undefined> {
    const userId = req.user.userId;
    return await this.todosService.update(userId, id, updateTodoDto);
  }

  @Delete(':id')
  @UsePipes(ValidationPipe) // Apply validation pipeline
  async delete(@Param('id') id: number): Promise<{ message: string }> {
    return await this.todosService.delete(id);
  }
}
