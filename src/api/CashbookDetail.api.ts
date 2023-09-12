import { requests } from ".";


export const CashbookDetailApi = {
  deleteHistory: (cashbookId: number) => requests.delete(`v1/cash-book-detail/${cashbookId}`)
}