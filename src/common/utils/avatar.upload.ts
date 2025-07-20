import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";

export function AvatarUpload() {
    return FileInterceptor('image_url', {
        storage: diskStorage({
            destination: 'src/common/uploads/avatars',
            filename: (req, file, cb) => {
                const timestamp = Date.now();
                const originalName = file.originalname.replace(/\s+/g, '_')
                cb(null, `${timestamp}-${originalName}`)
            },
        }),
        fileFilter: (req, file, cb) => {

            if (!file.mimetype.match(/^image\/(jpg|jpeg|png)$/)) {
                return cb(new Error("Only image files (jpg, jpeg, png) are allowed"), false);
            }
            cb(null, true);

        }
    })
}

export function filesUploader(){
    return FileFieldsInterceptor(
    [
        { name: 'banner_url', maxCount: 1 },
        { name: 'introVideo', maxCount: 1 },
    ],
    {
        storage: diskStorage({ 
            destination: 'src/common/uploads/course-files',
            filename: (req, file, cb) => {
                const timestamp = Date.now();
                const originalName = file.originalname.replace(/\s+/g, '_')
                cb(null, `${timestamp}-${originalName}`)
            },
        }),
        fileFilter: (req, file, cb) => {
        if (file.fieldname === 'banner_url') {
            return /^image\/(jpg|jpeg|png)$/.test(file.mimetype)
            ? cb(null, true)
            : cb(new Error('Only JPG/PNG allowed'), false);
        }
        if (file.fieldname === 'introVideo') {
            return /^video\/(mp4|mov|webm)$/.test(file.mimetype)
            ? cb(null, true)
            : cb(new Error('Only MP4/MOV/WEBM allowed'), false);
        }
        cb(null, false);
        },
    },
    )
}