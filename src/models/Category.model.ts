export default class FirstCategory{
  id: number = -1
  cashBookId: number = -1
  name: string = ''
  secondCategoryList: SecondCategory[] = []
}

export class SecondCategory {
  cashBookId: number = -1
  firstCategoryId: number = -1
  id: number = -1
  name: string = ''
  thirdCategoryList: ThirdCategory[] = []

  isShowMoreMenu: boolean = false
}

export class ThirdCategory {
  id: number = -1
  name: string = ''

  isShowMoreMenu: boolean = false
}