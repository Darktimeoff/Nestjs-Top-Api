import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ReviewModel } from './review.model';

@Controller('review')
export class ReviewController {
  @Post('create')
  async create(@Body() dto: Omit<ReviewModel, '_id'>) {}

  @Get('product/:id')
  async getProduct(@Param('id') id: string) {}

  @Delete(':id')
  async delete(@Param('id') id: string) {}
}
