import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(userCredentials: AuthDto) {
    try {
      // generate the password hash
      const hash = await argon.hash(userCredentials.password);

      // save the new user in the db
      const user = await this.prisma.user.create({
        data: {
          email: userCredentials.email,
          hash,
        },
      });
      delete user.hash;
      return user;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
    }
  }

  async signin(userCredentials: AuthDto) {
    // find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: userCredentials.email,
      },
    });

    const pwMatches = await argon.verify(user.hash, userCredentials.password);

    if (!user || !pwMatches)
      throw new ForbiddenException('Credentials incorrect');

    delete user.hash;

    return user;
  }
}
