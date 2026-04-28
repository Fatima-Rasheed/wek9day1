import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentModel } from '../schemas/document.schema';

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


}