import { FormattedRepoData } from './formatted-repo-data.interface';

export interface GetAllInternalRepositoriesByNameResponse {
  [key: string]: string | FormattedRepoData;
}
