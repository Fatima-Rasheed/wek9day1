import {
  Controller,
  Get,
  Delete,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
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
}