import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { PurchasedCourseService } from './purchased-course.service';
import { PurchasedCourseDto, UpdatePurchasedCourseDto } from './dto/dto';

@Controller('purchased-course')
export class PurchasedCourseController {
    constructor(private readonly purchasedCourseService: PurchasedCourseService){}

    @Get()
    getAll(){
        return this.purchasedCourseService.getAll()
    }

    @Post()
    create(@Body() payload: PurchasedCourseDto){
        return this.purchasedCourseService.create(payload)
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdatePurchasedCourseDto){
        return this.purchasedCourseService.update(id,payload)
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number,){
        return this.purchasedCourseService.delete(id)
    }
}
