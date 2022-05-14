import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { HhResponse } from './hh.models';
import { API_URL, CLUSTER_FIND_ERROR, SALARY_CLUSTER_ID } from './hh.constants';
import { HHDto } from '../top-page/dto/create-top-page.dto';

@Injectable()
export class HhService {
  private token: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.token = this.configService.get('HH_TOKEN') ?? '';
  }

  async getData(text: string) {
    try {
      const { data } = await this.httpService.axiosRef.get<HhResponse>(
        API_URL.vacancies,
        {
          params: {
            text,
            clusters: true,
          },
          headers: {
            'User-Agent': 'NestjsTopAPI/1.0 (yevhenii@gmail.com)',
            Authorization: 'Bearer ' + this.token,
          },
        },
      );

      return this.parseDate(data);
    } catch (e) {
      Logger.error(e);
    }
  }

  private parseDate(data: HhResponse): HHDto {
    const salaryCluster = data.clusters.find(
      (c) => c.id == SALARY_CLUSTER_ID,
    )?.items;

    if (!salaryCluster) {
      throw new Error(CLUSTER_FIND_ERROR);
    }

    const total = salaryCluster.length - 1;

    const juniorSalary = this.getSaleryFromString(salaryCluster[1].name);
    const middleSalary = this.getSaleryFromString(
      salaryCluster[Math.ceil(total / 2)].name,
    );
    const seniorSalary = this.getSaleryFromString(salaryCluster[total].name);

    return {
      count: data.found,
      juniorSalary,
      middleSalary,
      seniorSalary,
      updatedAt: new Date(),
    };
  }

  private getSaleryFromString(s: string): number {
    const numberRegExp = /(\d+)/g;
    const res = s.match(numberRegExp);

    if (!res) {
      return 0;
    }

    return Number(res[0]);
  }
}
