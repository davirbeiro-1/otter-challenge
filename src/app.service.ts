import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ExternalRepoService } from './externalRepo/externalRepo.service';
import { FormattedRepoData } from './shared/interfaces/formatted-repo-data.interface';
import { UserService } from './user/user.service';
import { RepositoryService } from './repository/repository.service';
import { RepositoryGithub } from './shared/interfaces/repository-github.interface';

@Injectable()
export class AppService {
  constructor(
    private readonly externalRepoService: ExternalRepoService,
    private readonly userService: UserService,
    private readonly repositoryService: RepositoryService,
  ) {}

  async getAllExternalRepositories(
    userName: string,
  ): Promise<Array<RepositoryGithub | string>> {
    const repositories = await this.fetchExternalRepository(userName);
    return await this.saveRequestedDataOnLocalDatabase(repositories);
  }

  async fetchExternalRepository(
    userName: string,
  ): Promise<FormattedRepoData[]> {
    return this.externalRepoService.fetchDataFromExternalRepoSource(userName);
  }

  async saveRequestedDataOnLocalDatabase(
    repositories: FormattedRepoData[],
  ): Promise<Array<RepositoryGithub | string>> {
    const firstRepository = repositories[0];

    await this.userService.saveUser(firstRepository.owner);

    return await Promise.all(
      repositories.map((repository) =>
        this.repositoryService.createRepository(repository),
      ),
    );
  }

  async getAllLocalRepositories(userName: string) {
    const user = await this.userService.userExists(userName);
    if (!user) {
      throw new HttpException(
        `User ${userName} doesn't exist on database`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.repositoryService.getAllRepositoriesFromUser(userName);
  }

  async findAllRepoByName(reposName: string) {
    const repoNames = reposName.split(' ');
    return await Promise.all(
      repoNames.map(async (repoName) => ({
        [repoName]: await this.repositoryService.getAllRepositoriesFromName(
          repoName,
        ),
      })),
    );
  }
}
