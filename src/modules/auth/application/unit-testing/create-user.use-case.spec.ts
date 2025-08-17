import { CreateUserUseCase } from '../use-cases/auth/create-user.use-case';
import { UserRepository } from '../../domain/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { BaseResponse } from '@betting-ground/prisma-lib';
describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockUserRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepo = {
      create: jest.fn(),
    } as any;

    useCase = new CreateUserUseCase(mockUserRepo);
  });

  it('should hash password and return BaseResponse with id and nick_name', async () => {
    const dto: CreateUserDto = {
      id: 'john',
      nick_name: 'Johnny',
      password: '123456',
      confirm_password: '123456',
      acquisition_source: '',
    };

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const mockUserEntity = {
      id: dto.id,
      nick_name: dto.nick_name ?? '',
      password: await bcrypt.hash(dto.password, 10),
      rule_type: 'regular' as 'regular',
    };

    mockUserRepo.create.mockResolvedValue(mockUserEntity);

    const result = await useCase.execute(dto);

    expect(mockUserRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: dto.id,
        password: expect.any(String),
        rule_type: 'regular',
      }),
    );

    const calledWith = mockUserRepo.create.mock.calls[0][0];
    const isHashed = await bcrypt.compare(dto.password, calledWith.password!);
    expect(isHashed).toBe(true);

    expect(result).toEqual(
      expect.objectContaining({
        id: dto.id,
        nick_name: dto.nick_name,
      }),
    );
  });

  it('should throw if password and confirm_password do not match', async () => {
    const dto: CreateUserDto = {
      id: 'john',
      nick_name: 'Johnny',
      password: '123456',
      confirm_password: '654321',
      acquisition_source: '',
    };

    await expect(useCase.execute(dto)).rejects.toThrowError(
      'Password and confirm password do not match',
    );
  });
});
