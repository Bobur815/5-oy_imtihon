import { existsSync, unlink } from "fs";
import { join } from "path";

export async function removeOldAvatar(type: string, image_url: string): Promise<void> {
    let imagePath
    if(type==='user'){
        imagePath = join(process.cwd(), 'src', 'common', 'uploads', 'avatars', image_url);
    } else if(type==='course') {
        imagePath = join(process.cwd(), 'src', 'common', 'uploads', 'course-files', image_url);
    }
        if (existsSync(imagePath)) {
            try {
                await unlink(imagePath, (err) => {
                    console.log(err);
                })

            } catch (error) {
                console.log(error.message);
            }
        }
    }