// application/use-cases/logout.use-case.ts
import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class LogoutUseCase {
  async execute(res: Response) {
    res.clearCookie('refresh_token');
    return res.json({
          message:"Successfully Logged Out"
    });
    
  }
}
