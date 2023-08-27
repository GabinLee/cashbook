export type ModalData = {
  message: string
  leftButtonText?: string
  rightButtonText: string
  onClickLeftButton?: () => void
  onClickRightButton: () => void
}