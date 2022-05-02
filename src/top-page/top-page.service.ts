import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TopPageDocument, TopPageModel } from './top-page.model';
@Injectable()
export class TopPageService {
  constructor(
    @InjectModel('TopPage')
    private readonly topPageModel: Model<TopPageDocument>,
  ) {}

  async create(dto: CreateTopPageDto): Promise<TopPageDocument> {
    return this.topPageModel.create(dto);
  }

  async findById(id: string): Promise<TopPageDocument | null> {
    return this.topPageModel.findById(id).exec();
  }

  async updateById(id: string, dto: Partial<TopPageModel>) {
    return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async deleteById(id: string): Promise<TopPageDocument | null> {
    return this.topPageModel.findByIdAndDelete(id).exec();
  }

  async findByCategory(dto: FindTopPageDto): Promise<TopPageDocument | null> {
    return this.topPageModel
      .findOne({
        firstLevelCategory: dto.firstCategory,
      })
      .exec();
  }
}
