import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { AssignedCourseDto, UpdateAssignedCourseDto } from './dto/dto';
import { responseMessage } from 'src/common/utils/response.message';

@Injectable()
export class AssignedCourseService {
    constructor(private readonly prisma: PrismaService){}

    async getAll(){
        const assignedCourses = await this.prisma.assignedCourse.findMany({
            include:{
                user:{
                    select:{
                        fullName:true,
                        role:true
                    }
                },
                course:{
                    select:{
                        name:true
                    }
                }
            }
        })
        return responseMessage("",assignedCourses)
    }

    async create(payload:AssignedCourseDto){
        const isExists = await this.prisma.assignedCourse.findFirst({
            where:{
                userId:payload.userId,
                courseId:payload.courseId
            }
        })
        if(isExists){
            throw new ConflictException("User already assigned to this course")
        }

        const newAssignment = await this.prisma.assignedCourse.create({
            data:{
                ...payload
            }
        })

        return responseMessage("New assignment created", newAssignment)
    }

    async update(id:number, payload:UpdateAssignedCourseDto){
        const isExists = await this.prisma.assignedCourse.findUnique({
            where:{id}
        })

        if(!isExists){
            throw new NotFoundException("Assignment not found")
        }

        const updatedAssignment = await this.prisma.assignedCourse.update({
            data:{
                ...payload
            }, 
            where:{id}
        })

        return responseMessage("Assignment successfully updated", updatedAssignment)
    }

    async delete(id:number){
        const isExists = await this.prisma.assignedCourse.findUnique({
            where:{id}
        })

        if(!isExists){
            throw new NotFoundException("Assignment not found")
        }

        await this.prisma.assignedCourse.delete({
            where:{id}
        })

        return responseMessage("Assignment successfully deleted")
    }
}
