import { useState } from 'react'
import { Link } from 'react-router-dom'

const Feed = ({ feed }) => {
  const [viewFeed, setViewFeed] = useState(false)

  const onClick = () => {
    setViewFeed(!viewFeed)
  }
  return (
    <Link to={`/feeds/${feed.id}`}>
      <div href='#' className='card'>
        <img
          src={
            feed.rss.rss.channel[0].image
              ? feed.rss.rss.channel[0].image[0].url
              : null
          }
          alt=''
        />

        <div className='text-gradient'>
          <p>{feed.name}</p>
        </div>
      </div>
    </Link>
  )
}

export default Feed
