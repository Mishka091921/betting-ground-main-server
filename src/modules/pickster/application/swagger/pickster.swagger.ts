import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiBody,
} from '@nestjs/swagger';

export const SwaggerRqPicksterList = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get Pickster List',
      description: 'Returns the list of Picksters.',
    }),
    ApiBearerAuth('Bearer'),
    ApiOkResponse({
      description: 'Successfully retrieved list of Picksters',
      schema: {
        example: {
          result: 1,
          message: 'Success',
          data: [
            {
              pick_idx: 1,
              pickster_nick_name: 'SharpShooter88',
              thumbnail_path: 'https://example.com/thumbs/pickster1.jpg',
            },
          ],
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid or expired token',
    }),
  );

export const SwaggerRqPicksterDetail = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get Pickster Detail',
      description: 'Returns the detailed information of a specific Pickster.',
    }),
    ApiBearerAuth('Bearer'),
    ApiBody({
      required: true,
      schema: {
        type: 'object',
        properties: {
          pick_idx: { type: 'integer', example: 1 },
        },
        required: ['pick_idx'],
      },
    }),
    ApiOkResponse({
      description: 'Successfully retrieved Pickster detail',
      schema: {
        example: {
          result: 1,
          message: 'Success',
          data: [
            {
              pick_idx: 1,
              pickster_nick_name: 'SharpShooter88',
              thumbnail_path: 'https://example.com/thumbs/pickster1.jpg',
              pickster_intro: 'Professional analyst in football and basketball',
              view_count: 203,
              up_vote: 57,
            },
          ],
        },
      },
    }),
    ApiBadRequestResponse({ description: 'Invalid request or unauthorized' }),
  );
