import { TypeOrmModule } from '@nestjs/typeorm';

export const ormConfig: any = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'admin',
  database: 'todo-api',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true, // Set to false in production for schema management
  logging: true,
};

export const TypeOrmConfigModule = ormConfig;
