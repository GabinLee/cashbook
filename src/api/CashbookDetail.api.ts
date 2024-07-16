import { requests } from ".";
// import CashbookHistory from "../models/CashbookHistory.model";
// import FirstCategory from "../models/Category.model";
// import ListData from "../models/List.model";
// import PaymentMethod from "../models/PaymentMethod.model";


export const CashbookDetailApi = {
  // addHistory
  // editHistory
  deleteHistory: (cashbookId: number) => requests.delete(`v1/cash-book-detail/${cashbookId}`)
  // getHistoryList: (cashbookId: number, page: number, pageSize: number, categoryId: number[]) => requests.get<ListData<CashbookHistory>>(`v1/cash-book/${cashbookId}/detail`, {page, pageSize, categoryId}),
  // getCategoryList: (cashbookId: number) => requests.get<FirstCategory[]>(`v1/cash-book/${cashbookId}/trade-category`),
  // getPaymentMethod: (cashbookId: number) => requests.get<PaymentMethod[]>(`v1/cash-book/${cashbookId}/payment-method`)
}