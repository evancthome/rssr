const Confirmation = ({ toggleF, submitF, body, btnText }) => {
  return (
    <>
      <div className='flex items-center justify-center min-h-screen'>
        <div className='relative z-50 flex flex-col items-center justify-center p-8 bg-slate-200 w-max'>
          <p className='mb-8'>{body}</p>
          <div className='flex'>
            <button
              onClick={toggleF}
              className='px-4 py-2 mx-2 text-white rounded cursor-pointer bg-slate-600 hover:bg-slate-500'
            >
              Cancel
            </button>
            <button
              className='px-4 py-2 mx-2 text-white bg-red-600 rounded cursor-pointer hover:bg-red-500'
              onClick={submitF}
            >
              {btnText}
            </button>
          </div>
        </div>
      </div>

      <div
        onClick={toggleF}
        className='fixed inset-0 z-0 min-w-full min-h-screen overflow-hidden bg-slate-800/75'
      ></div>
    </>
  )
}

export default Confirmation
