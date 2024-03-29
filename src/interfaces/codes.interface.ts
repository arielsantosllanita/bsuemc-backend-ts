import { Types } from 'mongoose';

export interface Code {
  _id: string | Types.ObjectId;
  user: string | Types.ObjectId;
  code: string;
  type: 'ACCOUNT LOCK' | 'RESET PASSWORD';
  expireAt: Date;
}
