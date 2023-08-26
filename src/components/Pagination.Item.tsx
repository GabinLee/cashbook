import styled from "styled-components";
import { Colors } from "../style/Styles";
// import { ModalData } from "../models/AlertModal";
// import BaseModal from "./BaseModal.modal";

type PaginationItemProps = {
  page: number
  count: number
  rowsOfPage: number
  onChangePage: (page: number) => void
}

export default function PaginationItem(props: PaginationItemProps) {

  return (
    <PaginationDiv>
      <button type="button"
        className="prev"
        onClick={() => {}}
      />
      {[...Array(6)].map((page, index) => (
        <button type="button"
          key={`page${index}`}
        >{page}{index+1}</button>
      ))}

      <button type="button"
        className="next"
        onClick={() => {}}
      />
    </PaginationDiv>
  );
}


const PaginationDiv  = styled.div`
  padding: 10px 12px 0;
  display: flex;
  align-items: center;
  justify-content: center;

  button{
    width: 30px;
    height: 30px;
    border-radius: 6px;

    &.prev{
      margin-right: 8px;
      background: url(images/arrow_down.svg) no-repeat center center / 12px 12px;
      transform: rotate(90deg);
    }

    &.next{
      margin-left: 8px;
      background: url(images/arrow_down.svg) no-repeat center center / 12px 12px;
      transform: rotate(-90deg);
    }

    &:not(.prev):not(.next){
      margin: 0 4px;
      background-color: transparent;

      &.active{
        background-color: ${Colors.main};
        color: white;
      }

      &:not(.active):hover{
        background-color: ${Colors.light_main};
        color: ${Colors.main};
      }
    }
  }
`