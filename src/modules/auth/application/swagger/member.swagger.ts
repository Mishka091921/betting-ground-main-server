// modules/user/users.swagger.ts
import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';


export const SwaggerBaseUserInfo = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get User Base Info' }),
    ApiBearerAuth('Bearer'), 
    ApiOkResponse({
      description: 'Successfully retrieved user info',
      schema: {
        example: {
          result: 1,
          message: 'Success',
          data: [
            {
              id: 'john_test',
              nick_name: 'john_doe',
              level: 1,
              point: 0,
              membership_duration: 365,
            },
          ],
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid or expired token',
    }),
  );


export const SwaggerMyInfo = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Request your personal information',
      description: `Returns information about your account including:\n
    - ID / Nickname (Alias)\n
    - Days since account registration (e.g., 00)\n
    - Number of consecutive attendance days (e.g., 00)\n
    - My post count (e.g., 00) (with shortcut link)\n
    - My comment count (e.g., 00) (with shortcut link)\n
    - Number of customer inquiries (e.g., 00)\n
    - My message count (e.g., 00)`,
    }),
    ApiBearerAuth('Bearer'),
    ApiOkResponse({
      description: 'Successfully retrieved your account info',
      schema: {
        example: {
          result: 1,
          message: 'Success',
          data: [
            {
              id: 'john_doe',
              nick_name: 'John',
              membership_duration: 365,
              consecutive_login_days: 45,
              post_count: 12,
              comment_count: 34,
              inquiry_count: 2,
              message_count: 7,
            },
          ],
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid or expired token',
    }),
  );


export const swaggerChangePassword = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Change password',
      description: `Allows the user to change their password. Requires the current password and a matching new password confirmation.`,
    }),
    ApiBearerAuth('Bearer'),
    ApiBody({
      required: true,
      schema: {
        type: 'object',
        properties: {
          old_password: { type: 'string', example: 'oldPass123' },
          new_password: { type: 'string', example: 'newPass456' },
          new_confirm_password: { type: 'string', example: 'newPass456' },
        },
        required: ['old_password', 'new_password', 'new_confirm_password'],
      },
    }),
    ApiOkResponse({
      description: 'Password changed successfully',
      schema: {
        example: {
          result: 1,
          message: 'Password changed successfully',
          data: [],
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Validation error, mismatched passwords, or incorrect old password',
    }),
  );