// strapi-base.service.ts
import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Console } from 'console';
import { firstValueFrom } from 'rxjs';
import { BaseError } from '@betting-ground/prisma-lib';

@Injectable()
export class StrapiBaseService {
  constructor(protected readonly http: HttpService) {}

  protected async get<T = any>(url: string): Promise<T> {
    const response = await firstValueFrom(
      this.http.get(url, {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_ADMIN_TOKEN}`,
        },
      }),
    );
    return response.data;
  }

  protected async post<T = any>(path: string, data: any): Promise<T> {
    const url = `${process.env.STRAPI_URL}/api/${path}`;
    const response = await firstValueFrom(
      this.http.post(
        url,
        { data },
        {
          headers: {
            Authorization: `Bearer ${process.env.STRAPI_ADMIN_TOKEN}`,
          },
        },
      ),
    );
    return response.data;
  }

  protected async put<T = any>(url: string, data: any): Promise<T> {
    const plain_data = instanceToPlain(data);
    const fullUrl = url;
    const response = await this.http.axiosRef.put(
      fullUrl,
      {
        data: { ...plain_data },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_ADMIN_TOKEN}`,
        },
      },
    );

    return response.data;
  }

  protected async updateField<T = any>(url: string): Promise<T> {
    const fullUrl = `${process.env.STRAPI_URL}/api/${url}`;

    const response = await this.http.axiosRef.post(
      fullUrl,
      {},
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_ADMIN_TOKEN}`,
        },
      },
    );
    return response.data;
  }

  protected async delete<T = any>(path: string): Promise<T> {
    const url = `${process.env.STRAPI_URL}/api/${path}`;

    const response = await this.http.axiosRef.delete(url, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_ADMIN_TOKEN}`,
      },
    });

    return response.data;
  }
}
