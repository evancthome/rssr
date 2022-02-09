import { Link } from 'react-router-dom'

const ViewMostRecent = () => {
  return (
    <div className='w-full min-h-screen col-span-4 col-start-1 px-4 pt-4 md:px-16 md:col-start-2 md:col-span-3'>
      <div className='grid grid-cols-3'>
        <h1 className='col-start-2 font-mono text-4xl font-bold text-center place-self-center text-cyan-700'>
          Most Recent
        </h1>
        <Link
          to='/'
          className='col-start-3 px-4 py-2 mx-2 text-white rounded cursor-pointer place-self-end bg-slate-600 hover:bg-slate-500'
        >
          Back
        </Link>
      </div>
    </div>
  )
}

export default ViewMostRecent
