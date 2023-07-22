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
  UsePipes,
} from '@nestjs/common';
import { AppService } from './app.service';
import { RepositoryGithub } from './shared/interfaces/repository-github.interface';
import { Repository } from './shared/type/saved-repository.type';
import { GetAllRepositoriesResponse } from './shared/interfaces/get-all-repositories-response.interface';
import { GetInternalRepositoriesByUserNameResponse } from './shared/type/get-internal-repositories-by-username.type';
import { GetAllInternalRepositoriesByNameResponse } from './shared/interfaces/get-all-internal-repositories-by-name-response.interface';
import {
  CreateRepositoryDTO,
  createRepositorySchema,
} from './repository/dto/create-repository.dto';
import { JoiValidationPipe } from './validators/joi-schema-validator';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/external/user/:userName')
  @HttpCode(HttpStatus.CREATED)
  async getAllExternalRepositories(
    @Param('userName') userName: string,
  ): Promise<GetAllRepositoriesResponse> {
    try {
      this.validateParameter(userName);

      return this.formatExternalRepoResponse(
        await this.appService.getAllExternalRepositories(userName),
      );
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

  private formatExternalRepoResponse(
    unformattedResponse: Array<RepositoryGithub | string>,
  ): GetAllRepositoriesResponse {
    const formattedReponse = {
      alreadyExisted: [],
      newRepository: [],
    };
    unformattedResponse.forEach((element) => {
      typeof element === 'string'
        ? formattedReponse.alreadyExisted.push(element)
        : formattedReponse.newRepository.push(element);
    });
    return formattedReponse;
  }

  @Get('/internal/user/:userName')
  @HttpCode(HttpStatus.OK)
  async getAllInternalRepositories(
    @Param('userName') userName: string,
  ): Promise<GetInternalRepositoriesByUserNameResponse[]> {
    try {
      this.validateParameter(userName);
      return this.formatInternalRepoResponse(
        await this.appService.getAllLocalRepositories(userName),
      );
    } catch (error) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: 'There are some problem with the system.',
      });
    }
  }

  private formatInternalRepoResponse(
    response: Repository[],
  ): GetInternalRepositoriesByUserNameResponse[] {
    return response.map((element: Repository) => {
      delete element.id;
      delete element.userId;
      return element;
    });
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
