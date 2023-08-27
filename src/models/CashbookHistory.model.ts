import FirstCategory, { SecondCategory, ThirdCategory } from "./Category.model"
import PaymentMethod from "./PaymentMethod.model"

export default class CashbookHistory{
  id: number = -1
  date: string|null = null
  description: string = ''
  price: number = 0
  firstCategory: FirstCategory|null = null
  firstCategoryId: number = -1
  secondCategory: SecondCategory|null = null
  secondCategoryId: number = -1
  thirdCategory: ThirdCategory|null = null
  thirdCategoryId: number = -1
  paymentMethod: PaymentMethod|null = null
  paymentMethodId: number = -1
  imageList: HistoryReceipt[] = [];
}

export class HistoryReceipt {
  id: number = -1
  image: string = ''
}

export type HistoryFilter = {
  name: string
  isShowPopover: boolean
  itemList: FirstCategory[]
}

// export const ScheduleList: Schedule[] = [
//   {id: 5, nation: '태국', city: '푸켓', startDate: '2023.02.20', endDate: '2023.02.25'},
//   {id: 4, nation: '태국', city: '방콕', startDate: '2018.10.19', endDate: '2018.10.23'},
//   {id: 3, nation: '베트남', city: '다낭', startDate: '2018.02.12', endDate: '2018.02.16'},
//   {id: 2, nation: '일본', city: '후쿠오카', startDate: '2016.08.27', endDate: '2016.08.29'},
//   {id: 1, nation: '캄보디아', city: '시엠립', startDate: '2008.07.09', endDate: '2008.07.13'}
// ]