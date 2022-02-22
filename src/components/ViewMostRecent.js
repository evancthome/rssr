import { Link } from 'react-router-dom'
import FeedItem from './FeedItem'
import Avatar from './Avatar'
import Account from './Account'
import { IoReloadSharp } from 'react-icons/io5'
import { slide as Menu } from 'react-burger-menu'
import { useEffect, useState } from 'react'

const ViewMostRecent = ({ session, username, avatar, getFeeds, feeds }) => {
  const [firstFew, setFirstFew] = useState([])
  const [showAccount, setShowAccount] = useState(false)

  useEffect(() => {
    sortFeeds(feeds)
  }, [feeds])

  const sortFeeds = (feeds) => {
    let arr = []
    feeds.forEach((feed) => {
      feed.rss.rss.channel[0].item.map((i) => {
        return (i.name = feed.name)
      })
      if (feed.rss.rss.channel[0].image) {
        feed.rss.rss.channel[0].item.map((i) => {
          return (i.img = feed.rss.rss.channel[0].image[0].url)
        })
      }
      arr = [...feed.rss.rss.channel[0].item.slice(0, 10), ...arr]
    })
    const sorted = arr.sort(
      (a, b) => new Date(b.pubDate[0]) - new Date(a.pubDate[0]),
    )
    setFirstFew(sorted)
  }

  const onToggleAccount = () => {
    if (showAccount) {
      document.querySelector('body').classList.remove('overflow-hidden')
    }
    if (!showAccount) {
      document.querySelector('body').classList.add('overflow-hidden')
    }
    setShowAccount(!showAccount)
  }

  return (
    <>
      <Menu>
        <h2>RSSr</h2>
        <Avatar url={avatar} />
        <p className='username'>{username}</p>
        <button onClick={onToggleAccount}>View Account</button>
        <Link to='/' className='menu-item'>
          Home
        </Link>
      </Menu>
      <div className='container'>
        <div className='header'>
          <button className='header-item' onClick={getFeeds}>
            <IoReloadSharp size={20} />
          </button>
          <h1 className='font-mono text-4xl font-bold text-center text-cyan-700'>
            Most Recent
          </h1>
          <Link to='/' className='header-item'>
            Back
          </Link>
        </div>
        {showAccount ? (
          <Account
            showAccount={showAccount}
            setShowAccount={setShowAccount}
            session={session}
          />
        ) : null}
        <div className='view-feed'>
          {firstFew.map((i, j) => (
            <FeedItem key={j} i={i} displayName={true} />
          ))}
        </div>
      </div>
    </>
  )
}

export default ViewMostRecent
