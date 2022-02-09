import { useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'
import { IoIosArrowUp } from 'react-icons/io'
import FeedItem from './FeedItem'

const Feed = ({ feed }) => {
  const [viewFeed, setViewFeed] = useState(false)

  const onClick = () => {
    setViewFeed(!viewFeed)
  }
  return (
    <div className='container px-4 py-2 mx-auto mb-4 rounded shadow bg-slate-700'>
      <div className='flex justify-between'>
        <h1 className='inline-block my-2 text-lg font-bold text-white'>
          {feed.name}
        </h1>
        <button className='text-white' onClick={onClick}>
          {!viewFeed ? (
            <IoIosArrowDown size={25} />
          ) : (
            <IoIosArrowUp size={25} />
          )}
        </button>
      </div>
      <div>
        {viewFeed
          ? feed.rss.rss.channel[0].item
              .slice(0, 11)
              .map((i) => <FeedItem key={i.title} i={i} displayName={false} />)
          : ''}
      </div>
    </div>
  )
}

export default Feed