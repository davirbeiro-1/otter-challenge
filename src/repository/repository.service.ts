import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class RepositoryService {
  constructor(private databaseService: DatabaseService) {}

  async createRepository(repositoryData) {
    try {
      const repository = await this.getOneRepository(repositoryData.name);

      if (repository) {
        return repositoryData.name;
      }

      return await this.databaseService.repository.create({
        data: {
          repoId: repositoryData.id,
          createdAt: repositoryData.created_at,
          name: repositoryData.name,
          description: repositoryData.description,
          url: repositoryData.url,
          language: repositoryData.language,
          userId: repositoryData.owner.id,
        },
      });
    } catch (error) {}
  }

  async getOneRepository(name: string) {
    return await this.databaseService.repository.findFirst({
      where: { name },
    });
  }

  async getAllRepositoriesFromUser(userName: string) {
    return this.databaseService.repository.findMany({
      where: {
        user: {
          login: userName,
        },
      },
    });
  }

  async getAllRepositoriesFromName(repoName: string) {
    return this.databaseService.repository.findFirst({
      where: {
        name: repoName,
      },
    });
  }
}
