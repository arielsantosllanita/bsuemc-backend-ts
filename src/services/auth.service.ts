import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';
import { LeanDocument } from 'mongoose';
import { LoginDto } from '@/dtos/auth.dto';

class AuthService {
  public async login(userData: LoginDto, remainingAttempts: any): Promise<{ cookie: string; findUser: User; token: string }> {
    if (isEmpty(userData)) throw new HttpException(400, 'Please provide the correct data.');

    const findUser: LeanDocument<User> = await userModel.findOne({ email: userData.email }).lean();
    if (!findUser) throw new HttpException(409, 'Invalid email');

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) {
      throw new HttpException(409, `Invalid password, ${+remainingAttempts + 1} remaining attempt(s)`);
    }

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);

    return { cookie, findUser, token: tokenData };
  }

  protected createToken(user: User): string {
    const dataStoredInToken: DataStoredInToken = { _id: user._id };
    const secretKey: string = SECRET_KEY;
    // const expiresIn: number = 60 * 60;

    // return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
    return sign(dataStoredInToken, secretKey);
  }

  protected createCookie(tokenData: string): string {
    // return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}; Domain=localhost; SameSite=None; Secure; Path=/;`;
    return `Authorization=${tokenData}; HttpOnly; Domain=localhost; SameSite=None; Secure; Path=/;`;
  }
}

export default AuthService;
