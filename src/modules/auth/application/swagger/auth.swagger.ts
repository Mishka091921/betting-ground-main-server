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
} from '@nestjs/swagger';

export const SwaggerRegister = () =>
  applyDecorators(
  ApiOperation({ summary: 'Register a new user' }),
  ApiBody({
    description: 'User registration payload',
    required: true,
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        nick_name: { type: 'string' },
        password: { type: 'string' },
        confirm_password: { type: 'string' },
        acquisition_source: { type: 'string' },
      },
      example: {
        id: 'john_test',
        nick_name: 'john_doe',
        password: 'test',
        confirm_password: 'test',
        acquisition_source: 'Test',
      },
    },
  }),
  ApiCreatedResponse({
    description: 'User successfully registered',
    schema: {
      example: {
        result: 1,
        message: 'Successfully registered a player',
        data: [
          {
            id: 'john_test',
            nick_name: 'john_doe',
          },
        ],
      },
      },
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );

export const SwaggerLogin = () =>
  applyDecorators(
    ApiOperation({ summary: 'User login to get JWT token' }),
    ApiBody({
        description: 'User registration payload',
        required: true,
        schema: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            password: { type: 'string' },
          },
          example: {
            id: 'johntest',
            password: 'test',
          },
        },
      }),
  ApiOkResponse({
    description: 'User successfully logged in',
    schema: {
      example: {
        result: 1,
        message: 'Successfully Login a player',
        data: [
          {
            access_token:"5212310=1v240asdv0z-cacvni1-"
          },
        ],
      },
      },
    }),
    ApiUnauthorizedResponse({ description: 'Invalid credentials' }),
  );

export const SwaggerProfile = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get profile of logged-in user' }),
    ApiOkResponse({
      description: 'User profile returned successfully',
      schema: {
        example: {
          username: 'john_doe',
          email: 'john@example.com',
          fullName: 'John Doe',
        },
      },
    }),
  );

export const SwaggerLogout = () =>
  applyDecorators(
    ApiOperation({ summary: 'Logout user and clear session/token' }),
    ApiOkResponse({ description: 'User logged out successfully' }),
  );

export const SwaggerRefresh = () =>
  applyDecorators(
    ApiOperation({ summary: 'Refresh JWT token' }),
    ApiOkResponse({
      description: 'Token refreshed successfully',
      schema: {
        example: {
          access_token: 'new-jwt-token-string',
        },
      },
    }),
  );

  export const SwaggerNickname = () => 
    applyDecorators(
    ApiOperation({ summary: 'Check if Nickname exist' }),
    ApiOkResponse({
      description: 'Nickname is available or already taken',
      schema: {
        example: {
          result: 1,
          message: 'Nickname is available',
          data: {
            isAvailable: true,
          },
        },
      },
    }),
  );

  export const SwaggerCheckId = () =>
  applyDecorators(
      ApiOperation({ summary: 'Check if ID exist' }),
      ApiOkResponse({
        description: 'Id is available or already taken',
        schema: {
          example: {
            result: 1,
            message: 'Id is available',
            data: {
              isAvailable: true,
            },
          },
        },
      }),
    );
  
export const SwaggerTestRole = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Test access with role-based authorization' }),
    ApiOkResponse({
      description: 'Role check passed and user data returned',
      schema: {
        example: {
          message: 'Role check passed!',
          user: {
            sub: 'a56a4ea3-ec99-4d39-9cef-xxxx',
            username: 'john_doe',
            roles: ['player'],
          },
        },
      },
    }),
    ApiUnauthorizedResponse({ description: 'Unauthorized or invalid role' }),
  );
