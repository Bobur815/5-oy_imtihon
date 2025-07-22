import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Request } from 'express';

function filenameGenerator(req: Request, file: Express.Multer.File, cb: (err: Error | null, name: string) => void) {
  const timestamp = Date.now();
  const clean = file.originalname.replace(/\s+/g, '_');
  cb(null, `${timestamp}-${clean}`);
}

function makeStorage(dest: string) {
  return diskStorage({
    destination: dest,
    filename: filenameGenerator,
  });
}

function makeSingleUpload(
  field: string,
  dest: string,
  allowed: RegExp,
) {
  return FileInterceptor(field, {
    storage: makeStorage(dest),
    fileFilter: (_req, file, cb) => {
      allowed.test(file.mimetype)
        ? cb(null, true)
        : cb(new Error(`Only ${allowed} files allowed`), false);
    },
  });
}

function makeMultiUpload(
  fields: { name: string; maxCount: number }[],
  dest: string,
  allowedMap: Record<string, RegExp>,
) {
  return FileFieldsInterceptor(fields, {
    storage: makeStorage(dest),
    fileFilter: (_req, file, cb) => {
      const rule = allowedMap[file.fieldname];
      if (!rule) return cb(null, false);
      rule.test(file.mimetype)
        ? cb(null, true)
        : cb(new Error(`Only ${rule} for ${file.fieldname}`), false);
    },
  });
}

export const AvatarUpload = () =>
  makeSingleUpload('image_url', 'src/common/uploads/avatars', /^image\/(jpg|jpeg|png)$/);

export const lessonVideoUpload = () =>
  makeSingleUpload('video_url', 'src/common/uploads/lesson-videos', /^video\/(mp4|mov|webm)$/);

export const lessonFileUpload = () =>
  makeSingleUpload('file_url', 'src/common/uploads/lesson-files', /^application\/(pdf|docx?|txt)$/);

export const homeworkFileUpload = () =>
  makeSingleUpload('file', 'src/common/uploads/homework-files', /^application\/(pdf|docx?|txt)$/);

export const homeworkSubmissionFileUpload = () => 
    makeSingleUpload('file_url', 'src/common/uploads/homework-submission-files', /^application\/(pdf|docx?|txt)$/);
export const questionFileUpload = () => 
    makeSingleUpload('file_url', 'src/common/uploads/questions-files', /^application\/(pdf|docx?|txt)$/); 
export const questionAnswerFileUpload = () => 
    makeSingleUpload('file_url', 'src/common/uploads/question-answer-files', /^application\/(pdf|docx?|txt)$/); 

export const filesUploader = () =>
  makeMultiUpload(
    [
      { name: 'banner_url', maxCount: 1 },
      { name: 'introVideo', maxCount: 1 },
    ],
    'src/common/uploads/course-files',
    {
      banner_url: /^image\/(jpg|jpeg|png)$/,
      introVideo: /^video\/(mp4|mov|webm)$/,
    },
  );
