import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Category } from '../entities/category.entity';
import { BlogService } from '../blog/blog.service';
import { Blog } from '../entities/blog.entity';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, BlogService],
  imports: [TypeOrmModule.forFeature([Category, Blog])],
})
export class CategoriesModule {}
