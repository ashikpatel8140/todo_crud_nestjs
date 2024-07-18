import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateTodoDto, UpdateTodoDto } from './dto/todo.dto';
import { Todo } from './entities/todo.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(userId: number): Promise<Todo[]> {
    const options = { where: { user: {id: userId}} };
    console.log(options);
    
    return await this.todoRepository.find(options);
  }

  async findOne(userId: number, id: number): Promise<Todo | undefined> {
    // Create a FindOneOptions object for specific ID search
    const options = { where: {id, user: {id: userId}} };
    const todo = await this.todoRepository.findOne(options);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    return todo;
  }

  async create(userId: number, createTodoDto: CreateTodoDto): Promise<Todo> {
    let { title, status, description} = createTodoDto;
    const existingUser = await this.userRepository.findOne({ where: { id: userId } });
    const newTodo = this.todoRepository.create({title, status, description, user: existingUser});
    return await this.todoRepository.save(newTodo);
  }

  async update(userId: number, id: number, updateTodoDto: UpdateTodoDto): Promise<Todo | undefined> {
    const existingTodo = await this.findOne(userId, id); // Check if todo exists first
    if (!existingTodo) {
      throw new NotFoundException('Todo not found');
    }

    const updatedTodo = this.todoRepository.merge(existingTodo, updateTodoDto); // Merge changes
    return await this.todoRepository.save(updatedTodo);
  }

  async delete(id: number): Promise<{ message: string }>  {
    const result = await this.todoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Todo not found');
    }
    return { message: `Todo with ID ${id} deleted successfully.` };
  }
}
