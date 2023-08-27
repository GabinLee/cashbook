import { requests } from ".";
import CashbookHistory from "../models/CashbookHistory.model";
import ListData from "../models/List.model";

export const CashbookApi = {
  getHistoryList: (cashbookId: number, page: number, pageSize: number) => requests.get<ListData<CashbookHistory>>(`v1/cash-book/${cashbookId}/detail`, {page, pageSize}),
  //getHistoryList: (cashbookId: number) => requests.get<CashbookHistory[]>(`v1/cash-book/${cashbookId}/detail`),
}