import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from '../entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Blog } from '../entities/blog.entity';
import { BlogService } from '../blog/blog.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private blogService: BlogService,
  ) {}
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const newCategory = this.categoryRepository.create(createCategoryDto);
      return this.categoryRepository.save(newCategory);
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Napaka pri shranjevanju kategorije');
    }
  }

  findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  findOne(id: number): Promise<Category> {
    return this.categoryRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    try {
      await this.categoryRepository.update(id, updateCategoryDto);
      return this.findOne(id);
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Napaka pri posodabljanju kategorije');
    }
  }

  async remove(id: number): Promise<DeleteResult> {
    const blogs = await this.blogService.findByCategoryId(id);
    blogs.map((blog: Blog, i) => {
      this.blogService.remove(blog.id);
    });
    try {
      return this.categoryRepository.delete(id);
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Napaka pri brisanju');
    }
  }
}
