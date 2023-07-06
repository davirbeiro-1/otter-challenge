import { Global, Module } from '@nestjs/common';
import { RequesterService } from './requester.service';
import { AxiosProvider } from '../axios/axios.provider';

@Global()
@Module({
  providers: [RequesterService, AxiosProvider],
  exports: [RequesterService],
})
export class RequesterModule {}
