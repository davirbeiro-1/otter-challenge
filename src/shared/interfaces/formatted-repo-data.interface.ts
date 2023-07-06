import { OwnerGithub } from '../type/owner-github.type';

export interface FormattedRepoData {
  id: number;
  name: string;
  owner: OwnerGithub;
  description: string | null;
  url: string;
  created_at: string;
  language: string | null;
}
