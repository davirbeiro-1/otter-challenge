import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Repository } from './shared/type/saved-repository.type';
import { GetInternalRepositoriesByUserNameResponse } from './shared/type/get-internal-repositories-by-username.type';
import { GetAllInternalRepositoriesByNameResponse } from './shared/interfaces/get-all-internal-repositories-by-name-response.interface';
import {
  CreateRepositoryDTO,
  createRepositorySchema,
} from './repository/dto/create-repository.dto';
import { JoiValidationPipe } from './validators/joi-schema-validator';
import { FormatInternalRepoResponse } from './interceptors/format-internal-repo.interceptor';
import { FormatExternalRepoResponse } from './interceptors/format-external-repo.interceptor';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/external/user/:userName')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FormatExternalRepoResponse)
  async getAllExternalRepositories(
    @Param('userName') userName: string,
  ): Promise<any> {
    try {
      this.validateParameter(userName);
      return await this.appService.getAllExternalRepositories(userName);
    } catch (error) {
      return error;
    }
  }

  private validateParameter(parameter: string): void {
    if (!parameter) {
      throw new HttpException('Parameter is missing', HttpStatus.BAD_REQUEST);
    }

    this.IsEmptyString(parameter, 'Parameter cannot be empty');
  }

  private IsEmptyString(query: string, errorMessage: string): void {
    const emptyRegex = /^\s*$/;
    if (emptyRegex.test(query)) {
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/internal/user/:userName')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FormatInternalRepoResponse)
  async getAllInternalRepositories(
    @Param('userName') userName: string,
  ): Promise<GetInternalRepositoriesByUserNameResponse[]> {
    try {
      this.validateParameter(userName);
      return await this.appService.getAllLocalRepositories(userName);
    } catch (error) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: 'There are some problem with the system.',
      });
    }
  }

  @Get('/internal/repo')
  @HttpCode(HttpStatus.OK)
  async getAllInternalRepositoriesByRepoName(
    @Query('reposNames') query: string,
  ): Promise<GetAllInternalRepositoriesByNameResponse[]> {
    try {
      this.validateQueries(query);
      return this.formatResponseFromRepositoriesByRepoName(
        await this.appService.findAllRepoByName(query),
      );
    } catch (error) {
      throw error;
    }
  }

  private validateQueries(queries: string): void {
    queries.split(' ').forEach((query: string) => {
      this.IsEmptyString(query, 'Query cannot be empty');
    });
  }

  private formatResponseFromRepositoriesByRepoName(
    response,
  ): GetAllInternalRepositoriesByNameResponse[] {
    return response.map((element) => {
      const repoName = Object.keys(element)[0];
      const repoData = Object.values(element)[0];
      return {
        [repoName]: repoData !== null ? repoData : 'Repository doesnt exist',
      };
    });
  }

  @Get('/internal/repository/:id')
  @HttpCode(HttpStatus.OK)
  async getOneRepository(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Repository> {
    try {
      return await this.appService.getOneRepository(id);
    } catch (error) {
      throw error;
    }
  }

  @Post('/internal/repository/')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new JoiValidationPipe(createRepositorySchema))
  async createRepository(
    @Body() createRepositoryDto: CreateRepositoryDTO,
  ): Promise<Repository> {
    try {
      return await this.appService.createRepository(createRepositoryDto);
    } catch (error) {
      throw error;
    }
  }
}
