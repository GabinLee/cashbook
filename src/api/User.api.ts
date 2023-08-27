
import { requests } from '.'
import CashbookHistory from '../models/CashbookHistory.model';
import User from '../models/User.model';

export const UserApi = {  
  getMe: () => requests.get<User>('v1/user/me'),
};