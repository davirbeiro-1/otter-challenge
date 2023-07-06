import { Repository } from '../type/saved-repository.type';

export interface SavedRepositoryData {
  id: number;
  userId: number;
  login: string;
  avatar: string;
  Repository: Repository[];
}
