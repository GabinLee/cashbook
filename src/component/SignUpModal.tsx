import axios from "axios"
import { useEffect, useState } from "react"
import styled from "styled-components"

type SignUp = {
  onClickClose: () => void
  onComplete: () => void
}

export default function SignUpModal(props: SignUp) {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [nickname, setNickname] = useState('')
  // const [phone, setPhone] = useState('')

  const isValidId = /^[a-z]{1}[a-z0-9]{3,}$/;
  const [idMessage, setIdMessage] = useState('')

  const isValidPassword = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;
  const [passwordMessage, setPasswordMessage] = useState('')

  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState('')

  const isValidSignUp = !(userId && password && passwordConfirm);


  useEffect(() => {
    setUserId(userId.replace(/[^a-z0-9]/g, ""))
  }, [userId])

  useEffect(() => {
    setPassword(password.replace(/\s/g, ""))
  }, [password])

  useEffect(() => {
    setPasswordConfirm(passwordConfirm.replace(/\s/g, ""))
  }, [passwordConfirm])

  // useEffect(() => {
  //   if(tel.length < 13){
  //     setTel(tel.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d)/, "$1-$2-$3"))
  //   } else {
  //     setTel(tel.replace(/\D/g, "").replace(/(\d{3})(\d{4})(\d)/, "$1-$2-$3"))
  //   }

  //   if(!validTel.test(tel) && tel !== '') {
  //     console.log('error')
  //     setIsValidTel(false)
  //   } else{
  //     console.log('confirm')
  //     setIsValidTel(true)
  //   }
  // }, [phone])



  const signUp = () => {
    axios.post(`${process.env.REACT_APP_HOST_URL}v1/auth/sign-up`, {
      uid: userId,
      password: password,
      nickname: nickname
    })
    .then(response => {
      if(response.data.success){
        console.log('회원가입 성공', response.data)

        localStorage.setItem('token', response.data.data.token)
        props.onComplete()
      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
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
                onBlur={() => {
                  if(!isValidId.test(userId)) {
                    setIdMessage('영문, 숫자 조합으로 4자 이상, 첫글자는 영문만 사용하세요')
                  } else {
                    setIdMessage('')
                  }
                }}
              />
              {/* <button
                type="button"
                className="contained light_main"
                // disabled={}
                onClick={() => {}}
              >중복 확인</button> */}
            </div>
            {idMessage !== '' && (
              <p className="msg error">{idMessage}</p>
            )}
          </div>

          <div className="input_field message">
            <p>비밀번호</p>
            <input type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onBlur={() => {
                if(!isValidPassword.test(password)) {
                  setPasswordMessage('8~20자 영문, 숫자, 툭수문자를 사용하세요.')
                } else{
                  setPasswordMessage('')
                }
              }}
            />
            {passwordMessage !== '' && (
              <p className="msg error">{passwordMessage}</p>
            )}
          </div>

          <div className="input_field message">
            <p>비밀번호 확인</p>
            <input type="password"
              value={passwordConfirm}
              onChange={e => setPasswordConfirm(e.target.value)}
              onBlur={() => {
                if(password !== passwordConfirm) {
                  setPasswordConfirmMessage('비밀번호와 비밀번호 확인이 일치하지 않습니다.')
                } else{
                  setPasswordConfirmMessage('')
                }
              }}
            />
            {passwordConfirmMessage !== '' && (
              <p className="msg error">{passwordConfirmMessage}</p>
            )}
          </div>

          {/* <div className="input_field">
            <p>닉네임</p>
            <input type="text"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
            />
          </div> */}

          {/* 
          <div className="input_field">
            <p>연락처</p>
            <input type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
          </div>
          */}
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

        + .input_field{
          margin-top: 12px;
        }
      }
    }

    &_bottom{
      margin-top: 12px;
      button{
        &.main{
          flex: 2;
        }
      }
    }
  }
`