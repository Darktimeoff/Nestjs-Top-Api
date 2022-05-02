import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TopPageDocument } from './top-page.model';
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

  async updateById(id: string, dto: Partial<CreateTopPageDto>) {
    return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async deleteById(id: string): Promise<TopPageDocument | null> {
    return this.topPageModel.findByIdAndDelete(id).exec();
  }

  async findByCategory(
    dto: FindTopPageDto,
  ): Promise<
    Pick<TopPageDocument, 'alias' | 'secondCategory' | 'title'>[] | null
  > {
    return this.topPageModel
      .find(
        {
          firstLevelCategory: dto.firstCategory,
        },
        { alias: 1, secondCategory: 1, title: 1 },
      )
      .exec();
  }

  async findByAlias(alias: string): Promise<TopPageDocument | null> {
    return this.topPageModel.findOne({
      alias,
    });
  }
}
