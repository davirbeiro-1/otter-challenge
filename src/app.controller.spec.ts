import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getAllExternalRepositories: jest.fn(),
            getAllLocalRepositories: jest.fn(),
            findAllRepoByName: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('getAllExternalRepositories', () => {
    it('should return the formatted response when the user name exists on github', async () => {
      const userName = 'exampleUser';
      const mockResponse = [
        {
          id: 1,
          name: 'repo1',
          owner: {
            login: 'random',
            id: 123,
            node_id: 'random',
            avatar_url: 'random',
          },
          description: 'randomrepo',
          url: 'randomUrl',
          created_at: 'radnom',
          language: 'randomL',
        },
        'exist',
      ];

      jest
        .spyOn(appService, 'getAllExternalRepositories')
        .mockResolvedValue(mockResponse);

      const response = await appController.getAllExternalRepositories(userName);

      const expectedResponse = {
        alreadyExisted: [mockResponse[1]],
        newRepository: [mockResponse[0]],
      };

      expect(response).toEqual(expectedResponse);
    });

    it('should fail if the username is invalid', async () => {
      const userName = '';
      await expect(
        appController.getAllExternalRepositories(userName),
      ).rejects.toThrowError('Parameter is missing');
    });

    it('should fail if the username is invalid', async () => {
      const userName = '  ';
      await expect(
        appController.getAllExternalRepositories(userName),
      ).rejects.toThrowError('Parameter cannot be empty');
    });
  });

  describe('getAllInternalRepositories', () => {
    it('should return the formatted response when the user name exists on database', async () => {
      const userName = 'exampleUser';
      const mockResponse = [
        {
          id: 123,
          repoId: 123,
          createdAt: new Date(),
          name: 'string',
          description: 'string',
          url: 'string',
          language: 'string',
          userId: 1,
        },
      ];

      jest
        .spyOn(appService, 'getAllLocalRepositories')
        .mockResolvedValue(mockResponse);

      const response = await appController.getAllInternalRepositories(userName);

      mockResponse.forEach((mockRes) => {
        delete mockRes.id;
        delete mockRes.userId;
        delete mockRes.repoId;
      });
      const expectedResponse = mockResponse;
      expect(response).toEqual(expectedResponse);
    });

    it('should fail if the username is invalid', async () => {
      const userName = '';
      await expect(
        appController.getAllInternalRepositories(userName),
      ).rejects.toThrowError('Parameter is missing');
    });

    it('should fail if the username is invalid', async () => {
      const userName = '  ';
      await expect(
        appController.getAllInternalRepositories(userName),
      ).rejects.toThrowError('Parameter cannot be empty');
    });
  });

  describe('getAllInternalRepositoriesByRepoName', () => {
    it('should return the unexisting repository message when the repo doesnt exists on database', async () => {
      const repoName = 'secondExample firstExample';
      const mockResponse = [
        { ['secondExample']: null },
        { ['firstExample']: null },
      ];

      jest
        .spyOn(appService, 'findAllRepoByName')
        .mockResolvedValue(mockResponse);

      const response = await appController.getAllInternalRepositoriesByRepoName(
        repoName,
      );

      const expectedResponse = [
        {
          ['secondExample']: 'Repository doesnt exist',
        },
        {
          ['firstExample']: 'Repository doesnt exist',
        },
      ];
      expect(response).toEqual(expectedResponse);
    });

    it('should return the existing repository message when the repo exists on database', async () => {
      const repoName = 'secondExample firstExample';
      const mockedRepo = {
        id: 321312,
        repoId: 312,
        createdAt: new Date(),
        name: 'random',
        description: 'random',
        url: 'random',
        language: null,
        userId: 59835733,
      };
      const mockResponse = [
        {
          ['secondExample']: { ...mockedRepo },
        },
        { ['firstExample']: null },
      ];

      jest
        .spyOn(appService, 'findAllRepoByName')
        .mockResolvedValue(mockResponse);

      const response = await appController.getAllInternalRepositoriesByRepoName(
        repoName,
      );

      const expectedResponse = [
        {
          ['secondExample']: { ...mockedRepo },
        },
        {
          ['firstExample']: 'Repository doesnt exist',
        },
      ];
      expect(response).toEqual(expectedResponse);
    });
  });
});
