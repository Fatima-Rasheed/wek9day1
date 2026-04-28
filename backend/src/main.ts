import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

let app: any;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: [
        'https://week9day1frontend.vercel.app',
        'http://localhost:3000',
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });

    await app.init();
  }
  return app;
}

// Local development
if (process.env.NODE_ENV !== 'production') {
  bootstrap().then(async (nestApp) => {
    await nestApp.listen(process.env.PORT ?? 3001);
    console.log(`Backend running on http://localhost:${process.env.PORT ?? 3001}`);
  });
}

// Vercel serverless handler
export default async (req: any, res: any) => {
  const nestApp = await bootstrap();
  const server = nestApp.getHttpAdapter().getInstance();
  server(req, res);
};