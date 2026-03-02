import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private cloudinaryInstance;

  constructor(private configService: ConfigService) {
    const cloudConfig = this.configService.get('cloudinary');

    if (!cloudConfig?.api_key || !cloudConfig?.api_secret) {
      throw new Error('Cloudinary keys missing in environment variables');
    }

    this.cloudinaryInstance = cloudinary;
    this.cloudinaryInstance.config({
      cloud_name: cloudConfig.cloud_name,
      api_key: cloudConfig.api_key,
      api_secret: cloudConfig.api_secret,
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    folder = 'products',
  ): Promise<{ imageUrl: string; publicId: string }> {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const optimizedBuffer = await sharp(file.buffer)
      .resize({ width: 1024 })
      .jpeg({ quality: 70 })
      .toBuffer();
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinaryInstance.uploader.upload_stream(
        { folder, resource_type: 'image' },
        (error, result) => {
          if (error) {
            console.error(error);
            return reject(new InternalServerErrorException(error.message));
          }

          if (!result) {
            return reject(
              new InternalServerErrorException('No result returned'),
            );
          }

          resolve({
            imageUrl: result.secure_url,
            publicId: result.public_id,
          });
        },
      );

      uploadStream.end(optimizedBuffer);
    });
  }
  async deleteImage(publicId: string) {
    try {
      if (!publicId) throw new BadRequestException('Public ID is required');
      await this.cloudinaryInstance.uploader.destroy(publicId);
    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        'something went wrong , please try later',
        { description: String(error) },
      );
    }
  }
  async uploadMultipleImages(files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Files are required');
    }

    try {
      const uploadedImages: { imageUrl: string; publicId: string }[] = [];
      for (const file of files) {
        const uploaded = await this.uploadImage(file);
        uploadedImages.push(uploaded);
      }

      return uploadedImages;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'something went wrong , please try later',
        { description: String(error) },
      );
    }
  }
}
