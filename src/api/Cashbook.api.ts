import { requests } from ".";
import ListData from "../models/List.model";
import CashbookHistory from "../models/CashbookHistory.model";
import FirstCategory from "../models/Category.model";
import PaymentMethod from "../models/PaymentMethod.model";

export const CashbookApi = {
  getHistoryList: (cashbookId: number, year: string, month: string, page?: number, pageSize: number = 1000, firstCategories?: number[], secondCategories?: number[], paymentMethods?: number[]
    // , thirdCategories?: number[]
    ) => requests.get<ListData<CashbookHistory>>(`v1/cash-book/${cashbookId}/detail`, {year: parseInt(year), month: parseInt(month), page, pageSize, firstCategories: firstCategories?.join(','), secondCategories: secondCategories?.join(','), paymentMethods: paymentMethods?.join(',')
      // , thirdCategories: thirdCategories?.join(',')
    }),

  getCategoryList: (cashbookId: number) => requests.get<FirstCategory[]>(`v1/cash-book/${cashbookId}/trade-category`),

  getPaymentMethod: (cashbookId: number) => requests.get<PaymentMethod[]>(`v1/cash-book/${cashbookId}/payment-method`)
}