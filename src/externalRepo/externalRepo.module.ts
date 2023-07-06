import { Module } from '@nestjs/common';
import { ExternalRepoService } from './externalRepo.service';

@Module({
  providers: [ExternalRepoService],
  exports: [ExternalRepoService],
})
export class ExternalRepoModule {}
