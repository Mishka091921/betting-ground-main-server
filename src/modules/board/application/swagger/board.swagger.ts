import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiQuery,
} from '@nestjs/swagger';

export const SwaggerRqBoardList = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get Board List',
      description: 'Returns the list of board information.',
    }),
    ApiQuery({ name: 'category', type: String, example: 'SPORTS_INFO', required: true }),
    ApiQuery({ name: 'sub_category', type: String, example: 'SOCCER', required: true }),
    ApiQuery({ name: 'orderby_type', type: String, example: 'desc', required: false }),
    ApiQuery({ name: 'orderby_key', type: String, example: 'create_dt', required: false }),
    ApiQuery({ name: 'search_key', type: String, example: 'title', required: false }),
    ApiQuery({ name: 'search_word', type: String, example: 'update', required: false }),
    ApiQuery({ name: 'read_count', type: Number, example: 10, required: false }),
    ApiQuery({ name: 'page', type: Number, example: 1, required: true }),
    ApiOkResponse({
      description: 'Successfully retrieved board list',
      schema: {
        example: {
          result: 1,
          message: 'Success',
          data: {
            data:[
                {
                  idx: 101,
                  category: 'general',
                  sub_category: 'announcement',
                  member_idx: 12,
                  member_id: 'user202',
                  member_nick_name: 'GameMaster',
                  member_level: 5,
                  admin_idx: 3,
                  admin_id: 'admin01',
                  admin_nick_name: 'AdminHero',
                  title: 'Site Maintenance Notice',
                  comment_count: 4,
                  view_count: 189,
                  like_count: 32,
                  dislike_count: 2,
                  thumbnail_path: 'https://example.com/board/thumb.jpg',
                  status: 'active',
                  update_dt: '2025-07-27T10:30:00Z',
                  create_dt: '2025-07-25T09:15:00Z',
                  is_admin: false,
                  user_level: 0,
                  formatted_created_time_date: '2025-08-07 14:47:20'
                },
              ],
           meta: {
            pagination: {
                page: 1,
                pageSize: 10,
                pageCount: 2,
                total: 12
              }
            },
            admin_notice: []
          }
        },
      },
    }),
    ApiBadRequestResponse({ description: 'Invalid request or unauthorized' }),
  );


export const SwaggerLatestBoardList = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get Board List',
      description: 'Returns the list of board information.',
    }),
    ApiQuery({ name: 'category', type: String, example: 'SPORTS_INFO', required: true }),
    ApiQuery({ name: 'sub_category', type: String, example: 'SOCCER', required: true }),
    ApiQuery({ name: 'orderby_type', type: String, example: 'desc', required: false }),
    ApiQuery({ name: 'orderby_key', type: String, example: 'create_dt', required: false }),
    ApiQuery({ name: 'search_key', type: String, example: '', required: false }),
    ApiQuery({ name: 'search_word', type: String, example: '', required: false }),
    ApiQuery({ name: 'read_count', type: Number, example: 10, required: false }),
    ApiQuery({ name: 'page', type: Number, example: 1, required: true }),
    ApiOkResponse({
      description: 'Successfully retrieved board list',
      schema: {
        example: {
          result: 1,
          message: 'Success',
          data: {
            data:[
                  {
                      "id": 183,
                      "documentId": "pxwn80wlij9sfnyif2z61c99",
                      "title": "AMERICAN-FOOTBALL TEST",
                      "createdAt": "2025-08-08T06:49:58.834Z"
                  },
                  {
                      "id": 182,
                      "documentId": "q8h7zw8tjrgpsckvio1sgrsb",
                      "title": "TEST VOLLEYBALL",
                      "createdAt": "2025-08-08T06:49:26.617Z"
                  },
              ],
          meta: {
            pagination: {
                page: 1,
                pageSize: 10,
                pageCount: 2,
                total: 12
              }
            },
            admin_notice: []
          }
        },
      },
    }),
    ApiBadRequestResponse({ description: 'Invalid request or unauthorized' }),
);


export const SwaggerRqBoardDetail = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get Board Detail',
      description: 'Returns the detail board info.',
    }),
    ApiOkResponse({
      description: 'Successfully retrieved board detail',
      schema: {
        example: {
          result: 1,
          message: 'Success',
          data: {
            idx: 101,
            category: 'general',
            sub_category: 'announcement',
            member_idx: 12,
            member_id: 'user202',
            member_nick_name: 'GameMaster',
            admin_idx: 3,
            admin_id: 'admin01',
            admin_nick_name: 'AdminHero',
            title: 'Site Maintenance Details',
            content: 'The site will be under maintenance on...',
            comment_count: 10,
            view_count: 500,
            like_count: 120,
            dislike_count: 4,
            thumbnail_path: 'https://example.com/thumb.jpg',
            img_path_list: [
              'https://example.com/image1.jpg',
              'https://example.com/image2.jpg',
            ],
            link_url: 'https://example.com',
            video_url: 'https://youtube.com/example',
            status: 'active',
            tag_list: ['maintenance', 'notice'],
            update_dt: '2025-07-27T15:00:00Z',
            create_dt: '2025-07-25T10:00:00Z',
          },
        },
      },
    }),
    ApiBadRequestResponse({ description: 'Invalid request or not found' }),
  );


export const SwaggerRqBoardPostComplete = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Complete Board Post',
      description: 'Called when the “Complete Post” button is clicked on the board.',
    }),
    ApiBearerAuth('Bearer'),
    ApiBody({
      required: true,
      schema: {
        type: 'object',
        properties: {
          category: { type: 'string', example: 'general' },
          sub_category: { type: 'string', example: 'discussion' },
          title: { type: 'string', example: 'What are your thoughts on XYZ?' },
          content: { type: 'string', example: 'Let’s discuss the implications of XYZ...' },
          thumbnail_path: { type: 'string', example: 'https://example.com/thumb.jpg' },
          img_path_list: {
            type: 'array',
            items: { type: 'string', example: 'https://example.com/image1.jpg' },
          },
          link_url: { type: 'string', example: 'https://example.com/article' },
          video_url: { type: 'string', example: 'https://youtube.com/example' },
          tag_list: {
            type: 'array',
            items: { type: 'string', example: 'strategy' },
          },
          pick_list: {
            type: 'array',
            items: { type: 'string', example: 'top' },
          },
        },
        required: ['category', 'sub_category', 'title', 'content'],
      },
    }),
    ApiOkResponse({
      description: 'Post created successfully',
      schema: {
        example: {
          result: 1,
          message: 'Success',
          data: [],
        },
      },
    }),
    ApiBadRequestResponse({ description: 'Invalid input or failed to post' }),
  );

export const SwaggerRqBoardPostEditComplete = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Edit Board Post - Complete',
      description: 'Called when the board information is edited and the “Complete” button is clicked.',
    }),
    ApiBearerAuth('Bearer'),
    ApiBody({
      required: true,
      schema: {
        type: 'object',
        properties: {
          category: { type: 'string', example: 'general' },
          sub_category: { type: 'string', example: 'announcement' },
          title: { type: 'string', example: 'Updated Post Title' },
          content: { type: 'string', example: 'Updated post content goes here...' },
          thumbnail_path: { type: 'string', example: 'https://example.com/updated_thumb.jpg' },
          img_path_list: {
            type: 'array',
            items: { type: 'string', example: 'https://example.com/updated_image1.jpg' },
          },
          link_url: { type: 'string', example: 'https://example.com/updated-link' },
          video_url: { type: 'string', example: 'https://youtube.com/updated-video' },
          tag_list: {
            type: 'array',
            items: { type: 'string', example: 'update' },
          },
          pick_list: {
            type: 'array',
            items: { type: 'string', example: 'featured' },
          },
        },
        required: ['category', 'sub_category', 'title', 'content'],
      },
    }),
    ApiOkResponse({
      description: 'Post updated successfully',
      schema: {
        example: {
          result: 1,
          message: 'Success',
          data: [],
        },
      },
    }),
    ApiBadRequestResponse({ description: 'Invalid input or failed to update post' }),
  );
