import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

export const SwaggerMyNoticeList = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get my notice list',
      description: `Fetches the user's personal notices based on category. Requires authentication.`,
    }),
    ApiBearerAuth('Bearer'),
    ApiBody({
      required: true,
      schema: {
        type: 'object',
        properties: {
          category: { type: 'string', example: 'system' },
        },
        required: ['category'],
      },
    }),
    ApiOkResponse({
      description: 'Successfully retrieved notice list',
      schema: {
        example: {
          result: 1,
          message: 'Success',
          data: [
            {
              idx: 101,
              title: 'Account Maintenance Notice',
              comment_count: 3,
              create_dt: '2025-07-28T10:20:00.000Z',
            },
          ],
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid or expired token, or missing category',
    }),
  );


export const SwaggerMyDetailNoticeInfo = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get detailed notice information',
      description: 'Returns the detailed information data of the notice.',
    }),
    ApiBearerAuth('Bearer'),
    ApiBody({
      required: true,
      schema: {
        type: 'object',
        properties: {
          idx: { type: 'number', example: 101 },
        },
        required: ['idx'],
      },
    }),
    ApiOkResponse({
      description: 'Successfully retrieved detailed notice information',
      schema: {
        example: {
          result: 1,
          message: 'Success',
          data: [
            {
              idx: 101,
              category: 'system',
              sub_category: 'maintenance',
              admin_idx: 1,
              admin_id: 'admin01',
              admin_nick_name: 'AdminUser',
              title: 'Scheduled Maintenance Notice',
              content: 'We will undergo maintenance on August 1.',
              comment_count: 5,
              view_count: 120,
              like_count: 25,
              dislike_count: 2,
              img_path_list: ['https://example.com/image1.jpg'],
              create_dt: '2025-07-28T10:20:00.000Z',
            },
          ],
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid or expired token, or missing idx',
    }),
  );
