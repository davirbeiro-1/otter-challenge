import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RepositoryModule } from './repository/repository.module';
import { DatabaseModule } from './database/database.module';
import { ExternalRepoModule } from './externalRepo/externalRepo.module';
import { RequesterModule } from './requester/requester.module';
import { UserModule } from './user/user.module';
import { AxiosProvider } from './axios/axios.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    RepositoryModule,
    DatabaseModule,
    ExternalRepoModule,
    RequesterModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AxiosProvider],
})
export class AppModule {}
