import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentModel } from '../schemas/document.schema';
import * as mammoth from 'mammoth';
import { extractText } from 'unpdf';

export interface UploadDocumentDto {
  title: string;
  topic: string;
  content: string;
  pros?: string[];
  cons?: string[];
  tags?: string[];
}

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(DocumentModel.name)
    private documentModel: Model<DocumentModel>,
  ) {}

  async upload(documentData: UploadDocumentDto) {
    const document = await this.documentModel.create({
      ...documentData,
      createdAt: new Date().toISOString().split('T')[0],
    });
    return {
      success: true,
      message: 'Document uploaded successfully',
      document: {
        id: document._id.toString(),
        title: document.title,
        topic: document.topic,
        createdAt: document.createdAt,
      },
    };
  }

  async getAllDocuments() {
    return this.documentModel.find().exec();
  }

  async getDocumentsByTopic(topic: string) {
    return this.documentModel.find({ topic }).exec();
  }

  async deleteDocument(id: string) {
    const result = await this.documentModel.findByIdAndDelete(id).exec();
    if (!result) throw new Error('Document not found');
    return { success: true, message: 'Document deleted successfully' };
  }

  async uploadFile(
    file: Express.Multer.File,
    metadata: { title?: string; topic: string; tags?: string },
  ) {
    try {
      let content = '';
      const fileExtension = file.originalname.split('.').pop()?.toLowerCase();

      if (fileExtension === 'pdf') {
        const { text } = await extractText(
          new Uint8Array(file.buffer),
          { mergePages: true },
        );
        content = Array.isArray(text) ? text.join('\n') : text;
      } else if (fileExtension === 'docx') {
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        content = result.value;
      } else if (fileExtension === 'txt') {
        content = file.buffer.toString('utf-8');
      } else {
        throw new HttpException(
          'Unsupported file type. Please upload PDF, DOCX, or TXT files.',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!content || content.trim().length === 0) {
        throw new HttpException(
          'Could not extract text from the file',
          HttpStatus.BAD_REQUEST,
        );
      }

      const title =
        metadata.title || file.originalname.replace(/\.[^/.]+$/, '');

      const tags = metadata.tags
        ? metadata.tags.split(',').map((t) => t.trim()).filter((t) => t)
        : [];

      const document = await this.documentModel.create({
        title,
        topic: metadata.topic,
        content: content.trim(),
        tags,
        pros: [],
        cons: [],
        createdAt: new Date().toISOString().split('T')[0],
      });

      return {
        success: true,
        message: 'File uploaded and processed successfully',
        document: {
          id: document._id.toString(),
          title: document.title,
          topic: document.topic,
          contentLength: content.length,
          createdAt: document.createdAt,
        },
      };
    } catch (error) {
      console.error('uploadFile service error:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        `Failed to process file: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}