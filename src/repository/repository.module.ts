import { Module } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { ExternalRepoModule } from '../externalRepo/externalRepo.module';

@Module({
  providers: [RepositoryService],
  imports: [ExternalRepoModule],
  exports: [RepositoryService],
})
export class RepositoryModule {}
