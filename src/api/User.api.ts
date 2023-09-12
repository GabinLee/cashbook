
import { requests } from '.'
import Cashbook from '../models/Cashbook.model';
import User from '../models/User.model';

export const UserApi = {  
  getMe: () => requests.get<User>('v1/user/me'),
  getCashbookList: () => requests.get<Cashbook[]>('v1/user/me/cash-book')
};