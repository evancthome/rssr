const Confirmation = ({ toggleF, submitF, body, btnText }) => {
  return (
    <>
      <div className='modal'>
        <p className='modal-content'>{body}</p>
        <div>
          <button onClick={toggleF} className='btn'>
            Cancel
          </button>
          <button className='btn delete' onClick={submitF}>
            {btnText}
          </button>
        </div>
      </div>
      <div onClick={toggleF} className='disabled'></div>
    </>
  )
}

export default Confirmation
