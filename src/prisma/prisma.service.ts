import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
    setTimeout(()=>{
        this.insertDiseases()
    },5000)
    setTimeout(()=>{
      this.insertVaccin()
    },5000)
    
  }

  async insertDiseases() {
    const diseases = [
      'Cancer',
      'Heart disease',
      'Stroke',
      "Alzheimer's disease",
      'Diabetes',
      'Influenza',
      'Pneumonia',
      'HIV/AIDS',
      'Tuberculosis',
      'Malaria',
      'Hepatitis',
      "Parkinson's disease",
      'Multiple sclerosis',
      'Epilepsy',
      'Arthritis',
      'Allergies',
      'Asthma',
      'Chronic obstructive pulmonary disease (COPD)',
      'Ulcer',
      'Gout',
    ];
    diseases.forEach(async (e)=>{
       const created= await this.disease.upsert({
            where:{
              diseaseName:e
            },update:{
                diseaseName:e
            },
            create:{
                diseaseName:e
            }
        })
        console.log(created);
        
    }) 
  }

  async insertVaccin(){
    const vaccines = [
      "COVID-19 vaccine",
      "Influenza vaccine",
      "Measles vaccine",
      "Mumps vaccine",
      "Rubella vaccine",
      "Polio vaccine",
      "Hepatitis B vaccine",
      "HPV vaccine",
      "Tetanus vaccine",
      "Diphtheria vaccine",
      "Pertussis vaccine",
      "Meningococcal vaccine",
      "Pneumococcal vaccine",
      "Rotavirus vaccine",
      "Varicella vaccine",
    ];

    vaccines.forEach(async (v)=>{
      const creted = await this.vaccin.upsert({
        where:{
          vaccinName:v
        },
        update:{
          vaccinName:v
        },
        create:{
          vaccinName:v
        }
      })
      console.log(creted);
      
    })
  }
}
