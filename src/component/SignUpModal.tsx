import { useEffect, useState } from "react"
import styled from "styled-components"

type SignUp = {
  onClickClose: () => void
}

export default function SignUpModal(props: SignUp) {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [passwordComfirm, setPasswordConfirm] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')


  useEffect(() => {
    // if(tel.length < 13){
    //   setTel(tel.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d)/, "$1-$2-$3"))
    // } else {
    //   setTel(tel.replace(/\D/g, "").replace(/(\d{3})(\d{4})(\d)/, "$1-$2-$3"))
    // }

    // if(!validTel.test(tel) && tel !== '') {
    //   console.log('error')
    //   setIsValidTel(false)
    // } else{
    //   console.log('confirm')
    //   setIsValidTel(true)
    // }
  }, [phone])


  const isValidSignUp = !(userId && password && passwordComfirm && name && phone)

  const signUp = () => {
  }


  return (
    <SignUpDiv className="modal">
      <div className="card">
        <h6 className="card_top">회원가입</h6>

        <div className="card_middle">
          <div className="input_field message">
            <p>아이디</p>
            <div className="flex">
              <input type="text"
                value={userId}
                onChange={e => setUserId(e.target.value)}
              />
              <button
                type="button"
                className="contained light_main"
                disabled
                onClick={() => {}}
              >중복 확인</button>
            </div>
            <p className="msg error">사용중인 아이디입니다.</p>
          </div>

          <div className="input_field message">
            <p>비밀번호</p>
            <input type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <p className="msg error">사용중인 아이디입니다.</p>
          </div>

          <div className="input_field message">
            <p>비밀번호 확인</p>
            <input type="password"
              value={passwordComfirm}
              onChange={e => setPasswordConfirm(e.target.value)}
            />
            <p className="msg error">사용중인 아이디입니다.</p>
          </div>

          <div className="input_field">
            <p>이름</p>
            <input type="text"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="input_field">
            <p>연락처</p>
            <input type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
          </div>
        </div>

        <div className="card_bottom">
          <button
            type="button"
            className="contained gray"
            onClick={props.onClickClose}
          >닫기</button>
          <button
            type="button"
            className="contained main"
            disabled={isValidSignUp}
            onClick={signUp}
          >가입하기</button>
        </div>
      </div>
    </SignUpDiv>
  )
}

const SignUpDiv = styled.div`
  .card{
    width: 360px;

    &_middle{
      .input_field{
        .light_main{
          margin-left: 6px;
          padding: 0 12px;
        }
      }
    }

    &_bottom{
      button{
        &.main{
          flex: 2;
        }
      }
    }
  }
`