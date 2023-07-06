import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { ExternalRepoService } from './externalRepo/externalRepo.service';
import { UserService } from './user/user.service';
import { RepositoryService } from './repository/repository.service';

describe('AppService', () => {
  let appService: AppService;
  let externalRepoService: ExternalRepoService;
  let userService: UserService;
  let repositoryService: RepositoryService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: ExternalRepoService,
          useValue: {
            fetchDataFromExternalRepoSource: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            saveUser: jest.fn(),
            userExists: jest.fn(),
          },
        },
        {
          provide: RepositoryService,
          useValue: {
            createRepository: jest.fn(),
            getAllRepositoriesFromUser: jest.fn(),
            getAllRepositoriesFromName: jest.fn(),
          },
        },
      ],
    }).compile();

    appService = app.get<AppService>(AppService);
    externalRepoService = app.get<ExternalRepoService>(ExternalRepoService);
    userService = app.get<UserService>(UserService);
    repositoryService = app.get<RepositoryService>(RepositoryService);
  });

  describe('getAllExternalRepositories', () => {
    it('should return the array of repositories and strings', async () => {
      const userName = 'exampleUser';
      const mockRepositories = [
        {
          id: 1,
          name: 'repo1',
          owner: {
            login: 'owner1',
            id: 123,
            avatar_url: 'avatar1',
          },
          description: 'repo1 description',
          url: 'repo1 url',
          created_at: 'randomDate',
          language: 'repo1',
        },
      ];

      jest
        .spyOn(externalRepoService, 'fetchDataFromExternalRepoSource')
        .mockResolvedValue(mockRepositories);

      jest
        .spyOn(repositoryService, 'createRepository')
        .mockResolvedValueOnce(mockRepositories[0]);

      const result = await appService.getAllExternalRepositories(userName);

      expect(result).toEqual(mockRepositories);
      expect(userService.saveUser).toHaveBeenCalledWith(
        mockRepositories[0].owner,
      );
      expect(repositoryService.createRepository).toHaveBeenCalledWith(
        mockRepositories[0],
      );
    });
  });

  describe('getAllLocalRepositories', () => {
    it('should return the repositories when the user exists', async () => {
      const userName = 'existingUser';
      const mockRepositories = [
        {
          id: 1231,
          repoId: 21312,
          createdAt: new Date(),
          name: 'random stirng',
          description: 'random stirng',
          url: 'random stirng',
          language: 'random stirng',
          userId: 13213,
        },
      ];

      jest.spyOn(userService, 'userExists').mockResolvedValue({
        id: 123,
        userId: 13212,
        login: 'stringNumber',
        avatar: 'stringNumber',
      });
      jest
        .spyOn(repositoryService, 'getAllRepositoriesFromUser')
        .mockResolvedValue(mockRepositories);

      const result = await appService.getAllLocalRepositories(userName);

      expect(result).toEqual(mockRepositories);
      expect(userService.userExists).toHaveBeenCalledWith(userName);
      expect(repositoryService.getAllRepositoriesFromUser).toHaveBeenCalledWith(
        userName,
      );
    });
  });
});
