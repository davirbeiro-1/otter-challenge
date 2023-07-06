import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UserService {
  constructor(private databaseService: DatabaseService) {}

  async saveUser(user) {
    if (await this.userExists(user.login)) {
      return;
    }
    return await this.databaseService.user.create({
      data: {
        userId: user.id,
        login: user.login,
        avatar: user.avatar_url,
      },
    });
  }

  async userExists(user): Promise<any> {
    return await this.databaseService.user.findFirst({
      where: { login: user },
    });
  }
}
