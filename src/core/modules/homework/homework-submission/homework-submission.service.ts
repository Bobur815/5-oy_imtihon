import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { responseMessage } from 'src/common/utils/response.message';
import { PrismaService } from 'src/core/database/prisma.service';
import { HomeworkSubmissionDto, UpdateHomeworkSubmissionDto } from './dto/dto';
import { UpdateHomeWorkDto } from '../dto/dto';
import { removeOldAvatar } from 'src/common/utils/remove-old-picture';

@Injectable()
export class HomeworkSubmissionService {
    constructor(private readonly prisma: PrismaService) { }

    async getAll() {
        const allSubmissions = await this.prisma.homeworkSubmission.findMany({
            include: {
                user: true,
                homework: true
            }
        })
        return responseMessage("", allSubmissions)
    }

    async getSingle(id: number) {
        const homeworkSubmission = await this.prisma.homeworkSubmission.findUnique({
            where: { id },
            include: {
                user: true,
                homework: true
            }
        })
        if(!homeworkSubmission) throw new NotFoundException("HomeworkSubmission not found")

        return responseMessage("", homeworkSubmission)
    }

    async create(payload: HomeworkSubmissionDto, filename: string) {
        payload.homeworkId = Number(payload.homeworkId)
        payload.userId = Number(payload.userId)
        const user = await this.prisma.user.findUnique({ where: { id: payload.userId } })
        const homework = await this.prisma.homework.findUnique({ where: { id: payload.homeworkId } })

        if(!user) throw new NotFoundException("User not found")
        if(!homework) throw new NotFoundException("Homework not found")

        const exists = await this.prisma.homeworkSubmission.findFirst({
            where: {
                userId: payload.userId,
                homeworkId: payload.homeworkId
            }
        })
        if (exists) {
            throw new ConflictException(`User with ID ${payload.userId} already submitted to this homework`)
        }

        if (!filename) throw new NotFoundException("File is required")


        const newSubmission = await this.prisma.homeworkSubmission.create({
            data: {
                ...payload,
                file_url: filename
            }
        })
        return responseMessage("Homework Submission saved", newSubmission)
    }

    async update(id: number, payload: UpdateHomeworkSubmissionDto, filename?: string) {
        const homeworkSubmission =  await this.getSingle(id)

        if(payload.userId){
            const user = await this.prisma.user.findUnique({ where: { id: payload.userId } })
            if(!user) throw new NotFoundException("User not found")
        }
        
        if(payload.homeworkId){
            const homework = await this.prisma.homework.findUnique({ where: { id: payload.homeworkId } })
            if(!homework) throw new NotFoundException("Homework not found")
        }

        if(filename && homeworkSubmission.data?.file_url){
            removeOldAvatar('homeworkSubmission', homeworkSubmission.data.file_url)
        }

        const updated = await this.prisma.homeworkSubmission.update({
            data:{
                ...payload,
                file_url:filename
            },
            where:{id}
        })

        return responseMessage("HomeworkSubmission updated", updated)
    }

    async delete(id: number) {
        await this.getSingle(id)

        await this.prisma.homeworkSubmission.delete({where:{id}})
        return responseMessage("Homework Submission deleted")
    }
}
