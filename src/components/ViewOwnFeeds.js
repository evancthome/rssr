import { useState } from 'react'
import { Link } from 'react-router-dom'
import AddFeed from './AddFeed'
import Feed from './Feed'

const ViewOwnFeeds = ({ accountOpen, getFeeds, feeds }) => {
  const [addOpen, setAddOpen] = useState(false)

  const onToggleAdd = () => {
    setAddOpen(!addOpen)
  }

  return (
    <div
      className={
        !accountOpen
          ? 'w-full min-h-screen col-span-3 col-start-1 md:row-start-1 row-start-2 px-4 pt-4 main md:px-16'
          : 'w-full min-h-screen col-span-3 col-start-2 md:row-start-1 row-start-2 overflow-hidden px-4 pt-4 main md:px-16'
      }
    >
      <div className='container flex items-center justify-between mx-auto mb-6'>
        <button
          onClick={onToggleAdd}
          className={
            'px-4 py-2 mx-2 text-white rounded cursor-pointer bg-slate-600 hover:bg-slate-500'
          }
        >
          {addOpen ? 'Close' : 'Add Feed'}
        </button>
        <h1 className='font-mono text-4xl font-bold text-center text-cyan-700'>
          Feeds
        </h1>
        <Link
          to='/recent'
          className='px-4 py-2 mx-2 text-white rounded cursor-pointer bg-slate-600 hover:bg-slate-700'
        >
          Most Recent
        </Link>
      </div>
      <div className={addOpen ? 'flex justify-center' : 'hidden'}>
        <AddFeed getFeeds={getFeeds} setAddOpen={setAddOpen} />
      </div>
      <div>
        {feeds.map((feed) => (
          <Feed key={feed.id} feed={feed} />
        ))}
      </div>
    </div>
  )
}

export default ViewOwnFeeds
