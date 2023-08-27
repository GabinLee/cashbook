import { useEffect, useRef } from "react";
import styled from "styled-components";
import { useOutsideTouch } from "../utils/Hooks";
// import { ModalData } from "../models/AlertModal";

type BaseModalProps = {
  children: React.ReactNode,
}

export default function BaseModal(prosp: BaseModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const isOutsideTouchMenu = useOutsideTouch(modalRef)

  // useEffect(() => {
  //   // if(isTouch) 
  // }, [isTouch])

  // useEffect(() => {
  //   if(isOutsideTouchMenu) setShowDropDownMenu(false)
  // }, [isOutsideTouchMenu])

  return (
    <BaseModalDiv className="base_modal">
      {prosp.children}
    </BaseModalDiv>
  );
}


const BaseModalDiv = styled.div`
  padding: 60px;
  background-color: rgba(0, 0, 0, 0.5);
  inset: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 101;

  .card{
    min-width: 260px;
    height: auto;
    max-height: 100%;
    border-radius: 24px;
    overflow: auto;

    &_top{
      padding: 24px 24px 12px;
      background-color: white;
      position: sticky;
      top: 0;
      z-index: 1;
    }

    &_middle{
      padding: 24px 24px 12px;
    }

    &_bottom{
      padding: 12px 24px 24px;
      display: flex;
      align-items: center;
      position: sticky;
      bottom: 0;
      button{
        flex: 1;
        height: 40px;
        border-radius: 6px;
        + button{
          margin-left: 12px;
        }
      }
    }
  }
`