import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { WorkflowService } from './workflow.service';

@Controller()
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post('ask')
  async ask(@Body() body: { question: string }) {
    return this.workflowService.processQuestion(body.question);
  }

  @Get('trace/:id')
  async getTrace(@Param('id') id: string) {
    return this.workflowService.getTrace(id);
  }
}
