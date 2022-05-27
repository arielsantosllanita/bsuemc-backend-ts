import { Types } from 'mongoose';

export interface Loan {
  _id: string | Types.ObjectId;
  type: string;
  applicant: string | Types.ObjectId;
  docs: Types.Array<any>;
  createdAt?: string;
  isApproved: boolean;
  isPending: boolean;
  transactBy: string | Types.ObjectId;
}