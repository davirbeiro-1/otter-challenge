import { Injectable } from '@nestjs/common';
import { RequesterService } from '../requester/requester.service';
import { FormattedRepoData } from '../shared/interfaces/formatted-repo-data.interface';
import { RepositoryGithub } from '../shared/interfaces/repository-github.interface';

enum REPO_DATA {
  ID = 'id',
  REPO_NAME = 'name',
  DESCRIPTION = 'description',
  URL = 'url',
  LANGUAGE = 'language',
  CREATED_AT = 'created_at',
  OWNER = 'owner',
}

@Injectable()
export class ExternalRepoService {
  private repositoryBaseUrl: string;

  constructor(private requesterService: RequesterService) {
    this.repositoryBaseUrl = 'https://api.github.com';
  }

  async fetchDataFromExternalRepoSource(
    userName: string,
  ): Promise<FormattedRepoData[]> {
    const repoData: RepositoryGithub[] = await this.requesterService.get(
      `${this.repositoryBaseUrl}/users/${userName}/repos`,
    );
    return this.processRepoData(repoData);
  }

  processRepoData(data: RepositoryGithub[]): FormattedRepoData[] {
    return data.map((element: RepositoryGithub) => {
      return Object.entries(element)
        .filter(([key]) => Object.values(REPO_DATA).includes(key as REPO_DATA))
        .reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {} as FormattedRepoData);
    });
  }
}
