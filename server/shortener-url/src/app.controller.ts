import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { map, Observable, of } from 'rxjs';

interface ShortenResponse {
  success: boolean;
}

interface ErrorResponse {
  error: string;
  code: number;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ping')
  ping(): string {
    return this.appService.ping();
  }

  @Post('url')
  async shorten(
    @Body('url') url: string,
  ): Promise<Observable<ShortenResponse | ErrorResponse>> {
    if (!url) {
      return of({
        error: `No url provided. Please provide in the body. E.g. {'url':'classcalc.com'}`,
        code: 400,
      });
    }
    return await this.appService.shorten(url).then(() =>
      of({
        success: true,
      }),
    );
  }

  @Get(':hash')
  retrieve(@Param('hash') hash): Observable<{ url: string }> {
    return this.appService.retrieve(hash).pipe(map((url) => ({ url })));
  }
}
