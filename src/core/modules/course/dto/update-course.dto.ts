import { PartialType } from "@nestjs/swagger";
import { CourseDto } from "./create-course.dto";

export class UpdateCourseDto extends PartialType(CourseDto){}