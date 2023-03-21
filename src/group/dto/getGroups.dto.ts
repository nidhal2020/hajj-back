export class GetGroupsDto {
  groups: {
    name: string;
    capacity: number;
    leaderName?: string;
    country: string;
  }[];
  totalPages: number;
  page : number
}
