import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AgentService } from './agent.service';
import { JwtGuard } from 'src/auth/guard';
import { CreateAgentDto, UpdateAgentDto } from './dto';
import { Agent } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('agent')
export class AgentController {
  constructor(private agentService: AgentService) {}

  @Post('createAgent')
  async createAgent(@Body() dto:CreateAgentDto){
    return await this.agentService.createAgent(dto)
  }

  @Get('getAllAgents')
  async getAllAgents(@Query() query: any):Promise<any>{
    const { page , pageSize}  = query
    return await this.agentService.findAll(page,pageSize)
  }
  @Get('getAgentById/:id')
  async getAgentById(@Param('id') id:string):Promise<Agent|null>{
    return await this.agentService.findOneById(id)
  }
  
  @Get('getAgentByMatricule/:matricule')
  async getAgentByMatricule(@Param('matricule') matricule:string):Promise<Agent|null>{
    return await this.agentService.findOneByMatricule(matricule)
  }

  @Patch('update/:id')
  async updateAgent(@Param('id' ) id:string,@Body() dto:UpdateAgentDto):Promise<Agent>{
    console.log('controller dto',dto);
    
    return await this.agentService.update(id,dto)
  }

  @Delete('delete/:id')
  async deleteAgent(@Param('id') id:string){
    return this.agentService.remove(id)
  }


  


}
