import { useEffect, useRef } from "react";
import styled from "styled-components"
import BasePopover from "./BasePopover"
import { Colors } from "../../style/Styles";
import { useOutsideTouch } from "../../utils/Hooks";


type PopoverMenuStyle = {
  btnSize: number;
}

type PopoverMenuProps = {
  isShowMoreMenu: boolean;
  onClickShowMenu: () => void;
  onClickHideMenu: () => void;
  onClickEdit: () => void;
  onClickDelete: () => void;
  styles: PopoverMenuStyle;
  // popoverRef: React.ForwardedRef<HTMLDivElement>
}

export default function PopoverMenu(props: PopoverMenuProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const isOutsideTouch = useOutsideTouch(popoverRef);

  useEffect(() => {
    if(props.isShowMoreMenu){
      if(isOutsideTouch) props.onClickHideMenu();
    }
  }, [isOutsideTouch])

  return (
    <PopoverMenuDiv {...props.styles}
      ref={popoverRef}
    >
      <button type="button"
        className={`btn more${props.isShowMoreMenu ? ' active' : ''}`}
        onClick={e => props.onClickShowMenu()}
      />

      {props.isShowMoreMenu && (
        <BasePopover>
          <button type="button"
            className="btn edit"
            onClick={props.onClickEdit}
          >수정</button>
          <button type="button"
            className="btn delete"
            onClick={props.onClickDelete}
          >삭제</button>
        </BasePopover>
      )}
    </PopoverMenuDiv>
    
  )
}

const PopoverMenuDiv = styled.div<PopoverMenuStyle>`
  position: relative;

  .btn.more{
    width: ${props => props.btnSize}px;
    height: ${props => props.btnSize}px;
    border-radius: 50%;
    background: url(images/more.svg) no-repeat center center / 12px 12px;
    transition: background-color .2s;

    &:hover, &.active{
      background-color: ${Colors.gray_e5};
    }
  }

  .popover{
    top: calc(${props => props.btnSize}px + 2px);
    right: 0;
    button{
      padding: 10px 24px;
      background-color: transparent;
      transition: background-color .2s;
      &:hover{
        background-color: ${Colors.gray_e};
      }

      &:first-child{
        border-radius: 12px 12px 0 0;
      }
      &:last-child{
        border-radius: 0 0 12px 12px;
      }
    }
  }


  //----------------------------------------
  /* 
  &_menu, &.card{
    z-index: 1;
  }

  &_menu{
    right: 0;
    button{
      padding: 10px 24px;
      &:hover{
        background-color: var(--gray_e);
      }
      &:first-child{
        border-radius: 12px 12px 0 0;
      }
      &:last-child{
        border-radius: 0 0 12px 12px;
      }
    }
  }

  &.card{
    .group_btn{
      margin-top: 24px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      button{
        height: 30px;
        padding: 0 12px;
        + button{
          margin-left: 12px;
        }
      }
    }
  } */
`