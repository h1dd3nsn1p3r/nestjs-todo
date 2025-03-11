import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { closeDatabaseConnection } from '@/data/db';

async function runApp() {
  const app = await NestFactory.create(AppModule);

  await app.listen(process.env.PORT ?? 3000);

  process.on('SIGINT', async () => {
    await app.close();
    closeDatabaseConnection();
  });

  process.on('SIGTERM', async () => {
    await app.close();
    closeDatabaseConnection();
  });
}
runApp();
