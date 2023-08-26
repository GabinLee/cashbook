import { useEffect, useRef } from "react";
import styled from "styled-components"
import BasePopover from "./BasePopover"
import { Colors } from "../../style/Styles";
import { useOutsideTouch } from "../../utils/Hooks";


type PopoverMenuProps = {
  children: React.ReactNode;
  filterName: string
  isShowFilterPopover: boolean;
  onClickShowPopover: () => void;
  onClickHidePopover: () => void;
  classname: string;
}


export default function PopoverFilter(props: PopoverMenuProps) {
  const popoverRef = useRef<HTMLLIElement>(null);
  const isOutsideTouch = useOutsideTouch(popoverRef);

  useEffect(() => {
    if(isOutsideTouch) props.onClickHidePopover();
  }, [isOutsideTouch])

  return (
    <PopoverFilterLi
      className="filter_item"
      ref={popoverRef}
    >
      <button
        className="filter_item_button"
        onClick={props.onClickShowPopover}
      >{props.filterName}</button>

      {props.isShowFilterPopover && (
        <BasePopover
          classname={props.classname}
        >
          {props.children}
        </BasePopover>
      )}
    </PopoverFilterLi>
    
  )
}


const PopoverFilterLi = styled.li`
  margin-right: 12px;
  position: relative;

  .filter_item_button{
    height: 36px;
    border-radius: 18px;
    padding: 0 34px 0 12px;
    background: white url(images/arrow_down.svg) no-repeat right 12px center / 10px 10px;
    box-shadow: rgba(34, 34, 34, 0.1) 2px 2px 6px 2px;
    &:hover{
      background-color: ${Colors.light_main};
    }
  }

  .popover{
    min-width: 288px;
    max-width: 360px;
    padding: 24px;
    top: 40px;
    left: 0;

    &.second{
      .first_group{
        + .first_group{
          margin-top: 24px;
        }

        .first_name{
          margin-bottom: 6px;
        }

        .checkbox_field{
          width: calc(50% - 6px);
          &:nth-child(even){
            margin-left: 12px;
          }
          &:nth-child(2) ~ .checkbox_field{
            margin-top: 6px;
          }
        }

        &.expense{
          .first_name{
            color: ${Colors.red};
          }
          input[type=checkbox]{
            &:checked + label .mark{
              border-color: ${Colors.red};
              background-color: ${Colors.red};
            }
            + label:hover::before{
              background-color: rgba(228,0,0, .2);
            }
          }
        }
        &.income{
          .first_name{
            color: ${Colors.green};
          }
          input[type=checkbox]{
            &:checked + label .mark{
              border-color: ${Colors.green};
              background-color: ${Colors.green};
            }
            + label:hover::before{
              background-color: rgba(56,138,73, .2);
            }
          }
        }
        &.saving{
          .first_name{
            color: ${Colors.yellow};
          }
          input[type=checkbox]{
            &:checked + label .mark{
              border-color: ${Colors.yellow};
              background-color: ${Colors.yellow};
            }
            + label:hover::before{
              background-color: rgba(246,146,0, .25);
            }
          }
        }
      }
    }

    &.payment_method{
      .checkbox_field + .checkbox_field{
        margin-top: 4px;
      }
    }
  }
`