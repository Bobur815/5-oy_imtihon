import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks()
  app.setGlobalPrefix('api')
  
  const config = new DocumentBuilder()
    .setTitle('My LMS API')
    .setDescription('Learning Management System API dokumentatsiyasi')
    .setVersion('1.0')
    .addBearerAuth()  
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Server is running on http://localhost:3000...`);
  console.log(`Swagger UI: http://localhost:3000/docs`);
}
bootstrap();
