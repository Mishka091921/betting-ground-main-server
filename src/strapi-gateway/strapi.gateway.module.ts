import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    HttpModule,
  ],
  controllers:[],
  providers: [],
  exports: [],
})
export class StrapiGatewayModule {}
