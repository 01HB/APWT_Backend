import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(
    session({
      name: 'NestJS_Session',
      secret: 'top-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 86400000,
        httpOnly: false,
        sameSite: 'none',
      },
    }),
  );

  await app.listen(3030, () => console.log('Server is running at port 3030'));
}

bootstrap();
