import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RequesterService {
  constructor(@Inject('AXIOS_INSTANCE') private readonly axiosInstance) {}
  async get(url: string): Promise<any> {
    try {
      return (await this.axiosInstance.get(url)).data;
    } catch (error) {
      if (error.code === 'ERR_BAD_REQUEST') {
        throw new HttpException(
          `Is this repo exists? ${error.config.url}`,
          HttpStatus.NOT_FOUND,
        );
      }
    }
  }
}
