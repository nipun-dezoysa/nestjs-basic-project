import { Injectable } from '@nestjs/common';
import { User, Bookmark } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password); //password hashing
    try {
      //prisma add new row to user
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          firstName: '',
          lastName: '',
        },
        // select: {
        //   id: true,
        //   email: true,
        //   createdAt: true,
        // },
      });
      delete user.hash;
      return user;
    } catch (e) {
      if(e instanceof PrismaClientKnownRequestError){
        //prisma error handling
        if(e.code === 'P2002'){
          throw new Error('Email already exists');
        }
      }
      throw e;
    }
  }

  signin() {
    return 'signin';
  }
}
