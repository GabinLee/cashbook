import { HTMLAttributes } from "react"
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Cashbook from "../models/Cashbook.model";
import type { CSSProperties } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Colors, Flex } from "../style/Styles";


type DraggableNavItemProps = {
  cashbook: Cashbook;
  classname?: string;
  onClick?: () => void;
  onMouseOver?: () => void;
  onMouseLeave?: () => void;
} & HTMLAttributes<HTMLDivElement>


export function DraggableNavItem(props: DraggableNavItemProps) {

  const location = useLocation();

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: props.cashbook.id
    // disabled: props.image !== undefined
  })

  const style: CSSProperties = {
    opacity: isDragging ? 1 : 1,
    transform: CSS.Translate.toString(transform),
    transition
  };

  const dragBtnStyle: CSSProperties = {
    cursor: isDragging ? "grabbing" : "grab"
  }

  useEffect(() => {
  }, [])

  if(props.cashbook === undefined) return (<></>);

  return (
    <DraggableNavItemBx
      ref={setNodeRef}
      className={props.classname}
      style={style}
      {...attributes}
      onClick={props.onClick}
      onMouseOver={props.onMouseOver}
      onMouseLeave={props.onMouseLeave}
    >
      <img src={`/images/nav_ic/cashbook${(props.cashbook.isActive || (location.pathname === `/${props.cashbook.id}`)) ? '_main' : ''}.svg`} alt={props.cashbook.name} className="ic cash" />
      
      <div className="flex1 flex ai-c">
        <span className="name">{props.cashbook.name}</span>
        {/* {props.cashbook.id} */}
        {props.cashbook.isGroup && (
          <img src={`/images/people${(props.cashbook.isActive || (location.pathname === `/${props.cashbook.id}`)) ? '_main' : ''}.svg`} alt={props.cashbook.name} className="ic people" />
        )}
      </div>

      <button className="btn drag" style={dragBtnStyle} {...listeners}>
        <img src={`/images/drag.svg`} alt="drag" className="ic drag" />
      </button>
    </DraggableNavItemBx>
  );
}

const DraggableNavItemBx = styled.li`
  width: calc(100% - 24px);
  height: 50px;
  margin: 12px 12px 0;
  padding-left: 12px;
  border: none;
  border-radius: 6px;
  background-color: transparent;
  cursor: pointer;
  ${Flex('', 'center', '')}
  transition: background-color .2s;
  &:hover, &.active{
    background-color: ${Colors.light_main};
    color: #2b80f0;
  }

  img{
    transition: all .2s;
    &.cash{
      width: 20px;
      margin-right: 12px;
    }
    &.people{
      width: 14px;
      margin-left: 6px;
    }
    &.drag{
      width: 12px;
      height: 12px;
    }
  }

  > div{
    color: inherit;
  }

  .name{
    color: inherit;
    text-align: left;
    transition: color .2s;
  }

  .btn.drag{
    width: 36px;
    height: 36px;
    ${Flex('', 'center', 'center')}
    background-color: transparent;
  }
`