import FeedItem from './FeedItem'

const Feed = ({ feed }) => {
  return (
    <div className='container px-4 py-2 mx-auto mb-4 rounded shadow bg-slate-700'>
      <h1 className='my-2 text-lg font-bold text-white'>{feed.name}</h1>
      {feed.rss.rss.channel[0].item.slice(0, 11).map((i) => (
        <>
          <FeedItem i={i} key={i.title} />
        </>
      ))}
    </div>
  )
}

export default Feed
