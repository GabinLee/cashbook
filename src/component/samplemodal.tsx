import styled from "styled-components";

type TransactionType = {
  // onClickCancel: () => void
}

export default function EditTransactionTypeModal(props: TransactionType) {
  return (
    <EditTransactionTypeDiv className="modal">
      <div className="card">
        <div className="card_bottom">
          <button
            type="button"
            className="contained gray"
            // onClick={props.onClickCancel}
          >취소</button>
          <button
            type="button"
            className="contained main"
            // disabled={isValidSignUp}
            // onClick={signUp}
          >확인</button>
        </div>
      </div>
    </EditTransactionTypeDiv>
  )
}

const EditTransactionTypeDiv = styled.div`
  
`