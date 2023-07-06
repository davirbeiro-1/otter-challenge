import { OwnerGithub } from '../type/owner-github.type';

export interface RepositoryGithub {
  id: number;
  name: string;
  owner: OwnerGithub;
  description: string;
  url: string;
  created_at: string;
  language: string | null;
}
