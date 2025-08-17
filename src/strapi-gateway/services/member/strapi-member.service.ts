// strapi-gateway.service.ts
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { StrapiBaseService } from '../strapi-base.service';

@Injectable()
export class StrapiMemberService extends StrapiBaseService {
  constructor(http: HttpService) {
    super(http);
  }

  async memberCreate(data): Promise<any> {
    // return this.post('members', data);
  }
}
