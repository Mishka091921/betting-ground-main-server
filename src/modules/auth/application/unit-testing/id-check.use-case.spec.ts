import { IdCheckUseCase } from '../use-cases/auth/id-check.use-case';
import { BadRequestException } from '@nestjs/common';

describe('IdCheckUseCase', () => {
  let idCheckUseCase: IdCheckUseCase;
  let userRepo: any;
  let res: any;

  beforeEach(() => {
    userRepo = {
      findById: jest.fn(),
    };
    res = {
      json: jest.fn(),
    };
    idCheckUseCase = new IdCheckUseCase(userRepo);
  });

  it('should throw BadRequestException if id already exists', async () => {
    userRepo.findById.mockResolvedValue({ id: 'existingUser' });
    await expect(idCheckUseCase.execute('existingUser', res)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if id contains special characters', async () => {
    userRepo.findById.mockResolvedValue(null);
    await expect(idCheckUseCase.execute('user!@#$', res)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if id is less than 4 characters', async () => {
    userRepo.findById.mockResolvedValue(null);
    await expect(idCheckUseCase.execute('abc', res)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if id is more than 24 characters', async () => {
    userRepo.findById.mockResolvedValue(null);
    await expect(idCheckUseCase.execute('a'.repeat(25), res)).rejects.toThrow(BadRequestException);
  });

  it('should pass for valid id (English, Korean, digits)', async () => {
    userRepo.findById.mockResolvedValue(null);
    await idCheckUseCase.execute('user123한글', res);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Successfully checked id',
      result: 1,
      data: [],
    });
  });

  it('should pass for valid id at boundary length (4 chars)', async () => {
    userRepo.findById.mockResolvedValue(null);
    await idCheckUseCase.execute('abcd', res);
    expect(res.json).toHaveBeenCalled();
  });

  it('should pass for valid id at boundary length (24 chars)', async () => {
    userRepo.findById.mockResolvedValue(null);
    await idCheckUseCase.execute('a'.repeat(24), res);
    expect(res.json).toHaveBeenCalled();
  });

  it('should throw BadRequestException for id with spaces', async () => {
    userRepo.findById.mockResolvedValue(null);
    await expect(idCheckUseCase.execute('user name', res)).rejects.toThrow(BadRequestException);
  });
});

// We recommend installing an extension to run jest tests.
