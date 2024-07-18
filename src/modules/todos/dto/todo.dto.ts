import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  title: string;

  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  status = false;
}

export class UpdateTodoDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
