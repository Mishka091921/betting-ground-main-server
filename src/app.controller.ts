import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from '@betting-ground/prisma-lib';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('test')
  getTest() {
    return { message: 'This is a test endpoint' };
  }
}
