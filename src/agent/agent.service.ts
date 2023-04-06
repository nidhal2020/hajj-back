import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAgentDto, UpdateAgentDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Agent } from '@prisma/client';

@Injectable()
export class AgentService {
  constructor(private prisma: PrismaService) {}

  async createAgent(agentdto: CreateAgentDto): Promise<any> {
    const hash = await argon.hash(agentdto.password);

    try {
      const agent = await this.prisma.agent.create({
        data: {
          matricule: agentdto.matricule,
          firstName: agentdto.firstName,
          lastName: agentdto.lastName,
          phone: agentdto.phone,
          email: agentdto.email,
          departement: agentdto.departement,
          password: hash,
        },
      });

      delete agent.password;
      return agent;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async findAll(takeNumber: string, takeSize: string): Promise<any> {
    try {
      const pageSize = parseInt(takeSize);
      const page = parseInt(takeNumber);
      const skip = page * pageSize;
      const totalCount = await this.prisma.agent.count();
      const totalPages = Math.ceil(totalCount / pageSize);
      const agents = await this.prisma.agent.findMany({
        skip: skip,
        take: pageSize,
      });
      return {
        agents: agents,
        totalPages: totalPages,
        page: page,
      };
    } catch (error) {
      return { message: error };
    }
  }
  async findOneById(id: string): Promise<Agent | null> {
    return this.prisma.agent.findUnique({
      where: {
        id,
      },
    });
  }
  async findOneByMatricule(matricule: string): Promise<Agent | null> {
    return this.prisma.agent.findUnique({
      where: {
        matricule,
      },
    });
  }
  async update(id: string, agentDto:UpdateAgentDto): Promise<Agent> {
    return this.prisma.agent.update({
      where: {
        id,
      },
      data: agentDto,
    });
  }
  async remove(id: string): Promise<Agent> {
    return this.prisma.agent.delete({
      where: {
        id,
      },
    });
  }
}
