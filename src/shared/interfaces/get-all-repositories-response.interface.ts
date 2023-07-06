import { RepositoryGithub } from './repository-github.interface';

export interface GetAllRepositoriesResponse {
  alreadyExisted: string[];
  newRepository: RepositoryGithub[];
}
