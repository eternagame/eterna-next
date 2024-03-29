import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default function createOpenAPIDocument(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API')
    .setVersion('1.0')
    .build();
  return SwaggerModule.createDocument(app, config, {
    // The client generator uses the operation ID for method names. By default, the class name is
    // included in addition to the method name - using just the method name creates a cleaner API
    operationIdFactory: (_, methodKey) => methodKey,
  });
}
