export type GetInternalRepositoriesByUserNameResponse = {
  repoId: number;
  createdAt: Date;
  name: string;
  description: string | null;
  url: string;
  language: string | null;
};
