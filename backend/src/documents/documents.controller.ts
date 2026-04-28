import {
  Controller,
  Get,
  Delete,
  Param,
  Query,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { DocumentsService } from './documents.service';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  async getAllDocuments(@Query('topic') topic?: string) {
    try {
      if (topic) {
        return await this.documentsService.getDocumentsByTopic(topic);
      }
      return await this.documentsService.getAllDocuments();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch documents',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteDocument(@Param('id') id: string) {
    try {
      return await this.documentsService.deleteDocument(id);
    } catch (error) {
      throw new HttpException(
        'Failed to delete document',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          // Use /tmp for serverless environments like Vercel
          const uploadPath = process.env.VERCEL ? '/tmp' : './uploads';
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + '-' + file.originalname);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
        ];
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new Error('Invalid file type. Only PDF, DOCX, and TXT are allowed'),
            false,
          );
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title?: string,
    @Body('topic') topic?: string,
  ) {
    try {
      if (!file) {
        throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
      }

      const document = await this.documentsService.processUploadedFile(
        file,
        title,
        topic,
      );
      return {
        success: true,
        message: 'Document uploaded successfully',
        document,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to upload document',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}