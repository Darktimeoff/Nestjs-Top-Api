import { Controller } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TopPageService } from 'src/top-page/top-page.service';

@Controller('sitemap')
export class SitemapController {
  domain: string;

  constructor(
    private readonly topPageService: TopPageService,
    private readonly configService: ConfigService,
  ) {
    this.domain = this.configService.get('DOMAIN') ?? '';
  }
}
