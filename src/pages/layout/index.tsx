import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Container } from "./styles";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Cashbook from "../../models/Cashbook.model";
import { useAppDispatch, useAppSelector } from "../../store";
import { setToken, setUser } from "../../store/appSlice";
import { DndContext, DragEndEvent, DragStartEvent, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import { DraggableNavItem } from "../../components/DraggableNavItem";
import { UserApi } from "../../api/User.api";



export default function LayoutPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useAppDispatch();

  const token = useAppSelector(state => state.app.token);
  const user = useAppSelector(state => state.app.user);

  const [cashbookList, setCashbookList] = useState<Cashbook[]>([]);

  // for drag overlay
  const [isDraggingNav, setIsDraggingNav] = useState<Cashbook>()

  useEffect(() => {
    getCashbookList();
    getUser();
  }, [])


  const getUser = () => {
    UserApi.getMe()
    .then(user => {
      dispatch(setUser(user));
    }).catch(error => console.log(error))
  }

  const signout = () => {
    localStorage.removeItem('token');
    dispatch(setToken(null));
    dispatch(setUser(null));
  }

  const getCashbookList = () => {
    axios.get(`${process.env.REACT_APP_HOST_URL}v1/user/me/cash-book`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      console.log('layout - getCashbookList')
      if(response.data.success){
        setCashbookList(response.data.data)
      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
  }

  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setIsDraggingNav(cashbookList.find((item) => item.id === active.id))
  }

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    if (active.id !== over.id) {
      setCashbookList((items) => {
        const activeIndex = items.findIndex(v => v.id === active.id);
        const overIndex = items.findIndex(v => v.id === over!.id);

        return arrayMove(items, activeIndex, overIndex)
      });
    }

    setIsDraggingNav(undefined);
  }, []);

  const handleDragCancel = useCallback(() => {
    setIsDraggingNav(undefined)
  }, []);


  return (
    <Container>
      <div className="header_nav">
        <header>
          <button type="button"
            onClick={e => navigate('/')}
          >
            <img src="/images/logo_white.svg" alt="로고 이미지" />
          </button>
        </header>

        <nav>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext items={cashbookList}
              strategy={rectSortingStrategy}
            >
              <ul>
                {cashbookList.map((cashbook, nIndex) => (
                  <DraggableNavItem
                    key={cashbook.id}
                    cashbook={cashbook}
                    classname={`${(cashbook.isActive || (location.pathname === `/${cashbook.id}`)) ? 'active' : ''}`}
                    onClick={() => {
                      navigate(`/${cashbook.id}`)
                    }}
                    onMouseOver={() => {
                      setCashbookList(cashbookList.map((v, i) => {
                        if(nIndex === i) v.isActive = true
                        return v
                      }))
                    }}
                    onMouseLeave={() => {
                      setCashbookList(cashbookList.map((v, i) => {
                        if(nIndex === i) v.isActive = false
                        return v
                      }))
                    }}
                  />
                ))}
              </ul>
            </SortableContext>

            
            {/* <DraggableOverlay
              dropAnimation={null}
            >
              {isDraggingNav ? 
                <DraggableNavItem
                  cashbook={isDraggingNav}
                />
              : null}
            </DraggableOverlay> */}
          </DndContext>

          {/* <button
            type="button"
            className={location.pathname === '/settings' ? 'active' : ''}
            onClick={e => {
              navigate('/settings')
            }}
            onMouseOver={() => setIsNavHover(true)}
            onMouseOut={() => setIsNavHover(false)}
          >
            <img src={`images/nav_ic/settings${isNavHover || (location.pathname === '/settings') ? '_main' : ''}.svg`} alt="설정"/>
              <span>설정</span>
          </button> */}
        </nav>
        
        <div className="area profile flex ai-c">
          <p className="flex1">{user?.nickname}</p>
          <button className="fs12"
            onClick={() => signout()}
          >로그아웃</button>
        </div>
      </div>

      <Outlet />

    </Container>
  )
}