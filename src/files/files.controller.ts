import {
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FileElementReponse } from './dto/file-element.response';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly fileService: FilesService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('files'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileElementReponse[]> {
    return this.fileService.saveFiles([file]);
  }
}
