import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../categories.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { CloudinaryService } from 'src/cloudinary/providers/cloudinary.service';

@Injectable()
export class CreateCategoryProvider {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  public async createCategory(
    createCategoryDto: CreateCategoryDto,
    file: Express.Multer.File,
  ) {
    const uploadedImage = await this.cloudinaryService.uploadImage(file);
    createCategoryDto.imageUrl = uploadedImage.imageUrl;
    try {
      let category = this.categoryRepository.create(createCategoryDto);
      category = await this.categoryRepository.save(category);
      return category;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Slug already exists');
      }

      throw new InternalServerErrorException(
        'Cannot create category, please try again later',
        { description: error },
      );
    }
  }
}
