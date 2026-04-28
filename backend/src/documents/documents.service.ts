import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentModel } from '../schemas/document.schema';
import * as fs from 'fs';
import * as path from 'path';
const pdfParse = require('pdf-parse');
import * as mammoth from 'mammoth';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(DocumentModel.name)
    private documentModel: Model<DocumentModel>,
  ) {}

  async getAllDocuments() {
    return this.documentModel.find().exec();
  }

  async getDocumentsByTopic(topic: string) {
    return this.documentModel.find({ topic }).exec();
  }

  async deleteDocument(id: string) {
    const result = await this.documentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new Error('Document not found');
    }
    return {
      success: true,
      message: 'Document deleted successfully',
    };
  }

  async processUploadedFile(
    file: Express.Multer.File,
    title?: string,
    topic?: string,
  ) {
    let content = '';

    try {
      // Extract text based on file type
      if (file.mimetype === 'application/pdf') {
        const dataBuffer = fs.readFileSync(file.path);
        const pdfData = await pdfParse(dataBuffer);
        content = pdfData.text;
      } else if (
        file.mimetype ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        const result = await mammoth.extractRawText({ path: file.path });
        content = result.value;
      } else if (file.mimetype === 'text/plain') {
        content = fs.readFileSync(file.path, 'utf-8');
      }

      // Create document in database
      const document = new this.documentModel({
        title: title || file.originalname,
        topic: topic || 'Uploaded Document',
        content: content.trim(),
        pros: [],
        cons: [],
        tags: ['uploaded'],
      });

      const savedDocument = await document.save();

      // Clean up uploaded file (important for serverless environments)
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      return savedDocument;
    } catch (error) {
      // Clean up file if processing fails
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw new Error(`Failed to process file: ${error.message}`);
    }
  }
}