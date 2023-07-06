export type Repository = {
  id: number;
  repoId: number;
  createdAt: Date;
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  userId: number;
};
