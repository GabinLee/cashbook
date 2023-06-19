import { useNavigate, useSearchParams } from "react-router-dom";
import { Container } from "./styles";
import { useEffect, useState } from "react";
import axios from "axios";
import SignUpModal from "../../component/SignUpModal";


export default function SignInPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [showSignUp, setShowSignUp] = useState(false)

  const isValidSignIn = !(userId && password)


  useEffect(() => {
    const code = searchParams.get('code')

    if(code !== null) {
      console.log('코드', code)
      signinKakao(code)
    }
  }, [searchParams])

  const signinKakao = (code: string) => {
    console.log('signinKakao')
    axios.post(`${process.env.REACT_APP_HOST_URL}v1/auth/token`, {
      type: 'kakao',
      code: code
    })
    .then(response => {
      console.log('카카오 로그인 성공', response.data)
      if(response.data.success){
        localStorage.setItem('token', response.data.data.token)

        navigate('/')
        getUser()
      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
  }

  const getUser = () => {
    console.log('getUser')
    const token = localStorage.getItem('token')

    if (token === null) return

    axios.get(`${process.env.REACT_APP_HOST_URL}v1/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      console.log('사용자', response.data)
      if(response.data.success){
        localStorage.setItem('user', JSON.stringify(response.data.data))

      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
  }

  const onClickLoginKakao = ()  => {
    console.log('onClickLoginKakao')

    const REST_API_KEY = '67a2cfcec81c116238e7fd3459c119e8';
    const REDIRECT_URI = 'http://localhost:3000/sign-in?type=kakao';
    // const REDIRECT_URI = `https://cash-book.netlify.app/sign-in?type=kakao`;
    
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`
  }

  const signIn = () => {
    axios.post(`${process.env.REACT_APP_HOST_URL}v1/auth/token`, {
      type: 'uid',
      uid: userId,
      password: password
    })
    .then(response => {
      if(response.data.success){
        console.log('로그인 성공', response.data.data)

        localStorage.setItem('token', response.data.data.token)
        navigate('/')
        getUser()
      } else{
        alert('error')
      }
    }).catch(error => console.log(error))
  }

  return (
    <>
      <Container className="sign-in flex">
        <div className="cont shadow">
          <h5>Cashbook 로그인</h5>

          <div className="id_pw">
            <div className="input_field id">
              <input type="text"
                placeholder="ID"
                value={userId}
                onChange={e => setUserId(e.target.value)}
              />
            </div>
            
            <div className="input_field pw">
              <input type="password"
                placeholder="PASSWORD"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* guest / abcd1234! */}

          <button
            type="button"
            className="contained main"
            onClick={signIn}
            disabled={isValidSignIn}
          >로그인</button>

          <div className="group_btn flex-c">
            {/* <button
              type="button"
              // onClick={() => {}}
            >아이디 찾기</button>
            <button
              type="button"
              // onClick={() => {}}
            >비밀번호 찾기</button> */}
            <button
              type="button"
              onClick={() => setShowSignUp(true)}
            >회원가입</button>
          </div>

          <p className="or">OR</p>
          
          <button
            type="button"
            className="kakao"
            onClick={onClickLoginKakao}
          >
            <img src="images/login_kakao.png" alt="카카오 로그인" />
          </button>
        </div>
      </Container>

      {showSignUp && (
        <SignUpModal
          onClickClose={() => setShowSignUp(false)}
          onComplete={() => {
            setShowSignUp(false)
          }}
        />
      )}
    </>
  )
}