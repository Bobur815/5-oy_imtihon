import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { responseMessage } from 'src/common/utils/response.message';
import { PrismaService } from 'src/core/database/prisma.service';
import { CourseCategoryDto } from './dto/dto';

@Injectable()
export class CourseCategoryService {
    constructor(private readonly prisma: PrismaService) { }

    async getAllCategories() {
        const categories = await this.prisma.courseCategory.findMany()
        return responseMessage("", categories)
    }

    async create(payload: CourseCategoryDto) {
        const category = await this.prisma.courseCategory.findFirst({
            where: { name: payload.name }
        })
        if (category) {
            throw new ConflictException(`Category exists with name ${payload.name}`)
        }

        const newCategory = await this.prisma.courseCategory.create({
            data: { name: payload.name }
        })
        return responseMessage("New category successfully created", newCategory)
    }

    async update(id:number, payload:CourseCategoryDto){
        const category = await this.prisma.courseCategory.findUnique({
            where:{id}
        })

        if(!category){
            throw new NotFoundException("Category not found")
        }

        const updatedCategory = await this.prisma.courseCategory.update({
            data:{name:payload.name},
            where:{id}
        })

        return responseMessage("Category updated successfully", updatedCategory)
    }

    async deleteCategory(id:number){
        const category = await this.prisma.courseCategory.findUnique({
            where:{id}
        })

        if(!category){
            throw new NotFoundException("Category not found")
        }

        await this.prisma.courseCategory.delete({
            where:{id}
        })

        return responseMessage("Category deleted successfully")
    }
}
