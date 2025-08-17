// modules/user/user.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../jwt.strategy';
import { UserRepositoryImpl } from '../user.repository.impl';
import { UserRepository } from '../../domain/user.repository';
import { AuthService } from './auth.service';
import { CreateUserUseCase } from '../../application/use-cases/auth/create-user.use-case';
import { LoginUseCase } from '../../application/use-cases/auth/login.use-case';
import { GetProfileUseCase } from '../../application/use-cases/auth/get-profile.use-case';
import { AuthController } from './auth.controller';
import { RefreshTokenUseCase } from '../../application/use-cases/auth/refresh-token.use-case';
import { LogoutUseCase } from '../../application/use-cases/auth/logout.use-case';
import { LoginTrackerService } from '../../domain/services/login-tracker.service';
import { NicknameCheckUseCase } from '../../application/use-cases/auth/nickname-check.use-case';
import { IdCheckUseCase } from '../../application/use-cases/auth/id-check.use-case';
import { CreateMemberAttendanceUseCase } from '../../application/use-cases/member/create-member-attendance.use-case';
import { GetMemberBasicUseCase } from '../../application/use-cases/member/get-member-basic.use-case';
import { GetMemberStartLoginUseCase } from '../../application/use-cases/member/get-member-created-at.use-case';
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '12h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    IdCheckUseCase,
    CreateUserUseCase,
    LoginUseCase,
    GetProfileUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    AuthService,
    LoginTrackerService,
    JwtStrategy,
    NicknameCheckUseCase,
    CreateMemberAttendanceUseCase,
    GetMemberStartLoginUseCase,
    GetMemberBasicUseCase,
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
  ],
})
export class AuthModule {}
