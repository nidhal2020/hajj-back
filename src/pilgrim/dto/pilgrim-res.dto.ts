export class PilgrimResponseDto {
    pilgrimss: {
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
    }[];
    totalPages: number;

  }