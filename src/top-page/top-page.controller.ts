import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { IdValidationPipe } from 'src/pipe/id-validation.pipe';
import { CreateTopPageDto } from './dto/create-top-pate.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TopPageModel } from './top-page.model';

@Controller('top-page')
export class TopPageController {
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateTopPageDto) {}

  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {}

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {}

  @Patch(':id')
  async patch(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: TopPageModel,
  ) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  async find(@Body() dto: FindTopPageDto) {}
}
