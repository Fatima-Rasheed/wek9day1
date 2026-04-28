import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { WorkflowService } from './workflow.service';

@Controller()
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post('ask')
  async ask(@Body() body: { question: string; uploadedOnly?: boolean }) {
    return this.workflowService.processQuestion(body.question, body.uploadedOnly || false);
  }

  @Get('trace/:id')
  async getTrace(@Param('id') id: string) {
    return this.workflowService.getTrace(id);
  }
}
