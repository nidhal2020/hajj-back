export class PilgrimResponseDto {
    pilgrimss: {
      id:string
      numPassport: string;
      name: string;
      lastName: string;
      gender: string;
      dateOfBirth: string;
      tel: string;
      groupID: string;
      groupName: string;
      countryName: string;
      countryId: string;
      status:any
    }[];
    totalPages: number;
    totale:number

  }