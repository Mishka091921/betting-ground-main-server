// modules/user/user.controller.ts

import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PicksterService } from "./pickster.service";
import { Public } from "@betting-ground/prisma-lib";
import { PicksterInfoResponse, PicksterReturn } from "../domain/interface/pickster.interface";
import { BaseResponse, buildResponse } from "@betting-ground/prisma-lib";
import { GetPicksterListDto } from "../application/dto/get-pickster-list.dto";


@ApiTags('Pickster')
@Controller({ path: 'pickster', version: '3' })
export class PicksterController {
  constructor(private readonly service: PicksterService) {}

  @Public()
  @Post('createPickster')
  async createPickster(@Body() body: any) {
    return this.service.createPickster(body);
  }

  @Public()
  @Get('getPicksterList')
  async getPicksterList(
    @Query() query: GetPicksterListDto 
  ): Promise<BaseResponse<PicksterReturn>> {
    const data = await this.service.getPicksterList(query);
    return buildResponse(1, "Successfully fetched Pickster List", data);
  }

  @Public()
  @Get(':member_idx')
  async getPicksterInfo(
    @Param('member_idx') member_idx: string,
  ): Promise<BaseResponse<PicksterInfoResponse>> {
    const data =  await this.service.getSpecificPickster(member_idx);
    return buildResponse(1,"Successfully fetched Board List",data);
  } 
}
