import { Link } from 'react-router-dom'
import FeedItem from './FeedItem'
import { IoReloadSharp } from 'react-icons/io5'
import { useEffect, useState } from 'react'

const ViewMostRecent = ({ accountOpen, getFeeds, feeds }) => {
  const [firstFew, setFirstFew] = useState([])

  useEffect(() => {
    sortFeeds(feeds)
  }, [feeds])

  const sortFeeds = (feeds) => {
    let arr = []
    feeds.forEach((feed) => {
      feed.rss.rss.channel[0].item.map((i) => {
        return (i.name = feed.name)
      })
      arr = [...feed.rss.rss.channel[0].item.slice(0, 10), ...arr]
    })
    const sorted = arr.sort(
      (a, b) => new Date(b.pubDate[0]) - new Date(a.pubDate[0]),
    )
    setFirstFew(sorted)
  }

  return (
    <div
      className={
        !accountOpen
          ? 'w-full min-h-screen col-span-3 row-start-2 md:row-start-1 col-start-1 px-4 pt-4 md:px-16'
          : 'w-full min-h-screen col-span-3 row-start-2 md:row-start-1 col-start-2 px-4 pt-4 md:px-16'
      }
    >
      <div className='flex items-center justify-between mb-6'>
        <button
          className='px-4 py-2 mx-2 text-white rounded cursor-pointer bg-slate-600 hover:bg-slate-500'
          onClick={getFeeds}
        >
          <IoReloadSharp size={20} />
        </button>
        <h1 className='font-mono text-4xl font-bold text-center text-cyan-700'>
          Most Recent
        </h1>
        <Link
          to='/'
          className='px-4 py-2 mx-2 text-white rounded cursor-pointer bg-slate-600 hover:bg-slate-500'
        >
          Back
        </Link>
      </div>
      <div>
        {firstFew.map((i, j) => (
          <FeedItem key={j} i={i} displayName={true} />
        ))}
      </div>
    </div>
  )
}

export default ViewMostRecent
