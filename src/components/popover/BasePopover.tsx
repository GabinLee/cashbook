import { useEffect, useRef } from "react";
import styled from "styled-components"
import { useOutsideTouch } from "../../utils/Hooks";

type BasePopoverProps = {
  children: React.ReactNode;
  classname?: string;
  onClickhide?: () => void;
}


export default function BasePopover(props: BasePopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const isOutsideTouch = useOutsideTouch(popoverRef);

  useEffect(() => {
    if(isOutsideTouch && props.onClickhide) props.onClickhide();
  }, [isOutsideTouch])

  return (
    <BasePopoverDiv className={`popover ${props.classname !== undefined ? props.classname : ''}`}
      ref={popoverRef}
    >
      {props.children}
    </BasePopoverDiv>
  )
}

const BasePopoverDiv = styled.div`
  border-radius: 12px;
  background-color: white;
  /* box-shadow: rgba(34, 34, 34, 0.1) 2px 2px 6px 2px; */
  box-shadow: rgba(34, 34, 34, 0.2) 6px 6px 12px 6px;
  overflow: hidden;
  position: absolute;
  z-index: 1;
`