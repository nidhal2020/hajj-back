import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { EmergencyContactService } from './emergency-contact.service';
import { CreateEmergencyContactDto, UpdateEmergencyContactDto } from './dto';
import { EmergencyContact } from '@prisma/client';

@Controller('emergency-contact')
export class EmergencyContactController {
  constructor(
    private readonly emergencyContactService: EmergencyContactService,
  ) {}

  @Post(':pilgrimId/contact')
  async createEmergencyContact(
    @Param('pilgrimId') pilgrimId: string,
    @Body() createEmergencyContactDto: CreateEmergencyContactDto,
  ): Promise<EmergencyContact> {
    try {
      const emergencyContact =
        await this.emergencyContactService.createEmergencyContact(
          createEmergencyContactDto,
          pilgrimId,
        );
      return emergencyContact;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get(':id')
  async getEmergencyContact(@Param('id') id: string) {
    try {
      const emergencyContact =
        await this.emergencyContactService.getEmergencyContactById(id);
      if (!emergencyContact) {
        throw new HttpException(
          'Emergency contact not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return emergencyContact;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Patch(':id')
  async updateEmergencyContact(
    @Param('id') id: string,
    @Body() updateEmergencyContactDto: UpdateEmergencyContactDto,
  ) {
    try {
      const emergencyContact =
        await this.emergencyContactService.updateEmergencyContact(
          id,
          updateEmergencyContactDto,
        );
      if (!emergencyContact) {
        throw new HttpException(
          'Emergency contact not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return emergencyContact;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Delete(':id')
  async deleteEmergencyContact(@Param('id') id: string) {
    try {
      await this.emergencyContactService.deleteEmergencyContact(id);
      return { message: 'Emergency contact deleted successfully' };
    } catch (error) {
      throw new HttpException(
        `Error deleting emergency contact: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
