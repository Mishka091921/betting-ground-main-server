import { PicksterInfoResponse } from "./interface/pickster.interface";

export abstract class PicksterRepository {
  abstract findMany(page: number, page_size: number): Promise<PicksterInfoResponse[]>;
  abstract count(): Promise<number>;
  abstract findOne(member_idx: number): Promise<PicksterInfoResponse | null>;
}
