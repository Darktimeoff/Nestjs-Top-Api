import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { addDays } from 'date-fns';
import { Model, Types } from 'mongoose';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TopLevelCategory, TopPageDocument } from './top-page.model';
@Injectable()
export class TopPageService {
  constructor(
    @InjectModel('TopPage')
    private readonly topPageModel: Model<TopPageDocument>,
  ) {}

  async create(dto: CreateTopPageDto): Promise<TopPageDocument> {
    return this.topPageModel.create(dto);
  }

  async findById(id: string | Types.ObjectId): Promise<TopPageDocument | null> {
    return this.topPageModel.findById(id).exec();
  }

  async findAll() {
    return this.topPageModel.find({}).exec();
  }

  async findForHhUpdate(date: Date) {
    return this.topPageModel
      .find({
        firstLevelCategory: TopLevelCategory.Courses,
        $or: [
          {
            'hh.updatedAt': {
              $lt: addDays(date, -1),
            },
          },
          {
            'hh.updatedAt': {
              $exists: false,
            },
          },
        ],
      })
      .exec();
  }

  async updateById(
    id: string | Types.ObjectId,
    dto: Partial<CreateTopPageDto>,
  ) {
    return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async deleteById(
    id: string | Types.ObjectId,
  ): Promise<TopPageDocument | null> {
    return this.topPageModel.findByIdAndDelete(id).exec();
  }

  async findByCategory(
    dto: FindTopPageDto,
  ): Promise<
    Pick<TopPageDocument, 'alias' | 'secondCategory' | 'title'>[] | null
  > {
    return this.topPageModel
      .aggregate()
      .match({
        firstLevelCategory: dto.firstCategory,
      })
      .group({
        _id: {
          secondCategory: '$secondCategory',
        },
        pages: {
          $push: { alias: '$alias', title: '$title' },
        },
      })
      .exec();
  }

  async findByAlias(alias: string): Promise<TopPageDocument | null> {
    return this.topPageModel.findOne({
      alias,
    });
  }

  async findByText(text: string): Promise<TopPageDocument[] | null> {
    return this.topPageModel
      .find({
        $text: {
          $search: text,
          $caseSensitive: false,
        },
      })
      .exec();
  }
}
