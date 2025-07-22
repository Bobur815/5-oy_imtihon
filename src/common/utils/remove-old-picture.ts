import { existsSync, unlink } from "fs";
import { join } from "path";

export function removeOldAvatar(type: string, image_url: string) {
    let imagePath
    if (type === 'user') {
        imagePath = join(process.cwd(), 'src', 'common', 'uploads', 'avatars', image_url);
    } else if (type === 'course') {
        imagePath = join(process.cwd(), 'src', 'common', 'uploads', 'course-files', image_url);
    } else if (type === 'lesson') {
        imagePath = join(process.cwd(), 'src', 'common', 'uploads', 'lesson-videos', image_url);

    } else if (type === 'lesson-files') {
        imagePath = join(process.cwd(), 'src', 'common', 'uploads', 'lesson-files', image_url);

    } else if (type === 'homework') {
        imagePath = join(process.cwd(), 'src', 'common', 'uploads', 'homework-files', image_url);

    } else if (type === 'questions') {
        imagePath = join(process.cwd(), 'src', 'common', 'uploads', 'questions-files', image_url);
    } else if (type === 'question-answer') {
        imagePath = join(process.cwd(), 'src', 'common', 'uploads', 'question-answer-files', image_url);
    }
    if (existsSync(imagePath)) {
        try {
            unlink(imagePath, (err) => {
                if (err) {
                    console.log(err);
                }
            })

        } catch (error) {
            console.log(error.message);
        }
    }
}