import { useState } from 'react'
import { Link } from 'react-router-dom'
import AddFeed from './AddFeed'
import Feed from './Feed'
import Avatar from './Avatar'
import Account from './Account'
import { slide as Menu } from 'react-burger-menu'

const ViewOwnFeeds = ({ session, username, avatar, getFeeds, feeds }) => {
  const [addOpen, setAddOpen] = useState(false)
  const [showAccount, setShowAccount] = useState(false)

  const onToggleAdd = () => {
    setAddOpen(!addOpen)
  }

  const onToggleAccount = () => {
    setShowAccount(!showAccount)
    if (showAccount) {
      document.querySelector('body').classList.remove('overflow-hidden')
    }
    if (!showAccount) {
      document.querySelector('body').classList.add('overflow-hidden')
    }
  }

  return (
    <div>
      <Menu>
        <h2>RSSr</h2>
        <Avatar url={avatar} />
        <p className='username'>{username}</p>
        {/* <a href='#'>Test</a> */}

        <Link to='/recent' className='menu-item'>
          Most Recent
        </Link>
        <button onClick={onToggleAccount}>View Account</button>
        {!addOpen ? (
          <button onClick={onToggleAdd} className={'menu-item'}>
            Add Feed
          </button>
        ) : null}
        {addOpen ? (
          <div>
            <AddFeed getFeeds={getFeeds} setAddOpen={setAddOpen} />
          </div>
        ) : null}
      </Menu>
      {showAccount ? (
        <Account
          showAccount={showAccount}
          setShowAccount={setShowAccount}
          session={session}
        />
      ) : null}
      <div className='container'>
        <div>
          <h1 className='font-mono text-4xl font-bold text-center text-cyan-700'>
            Feeds
          </h1>
        </div>
        {/* {addOpen ? (
          <div>
            <AddFeed getFeeds={getFeeds} setAddOpen={setAddOpen} />
          </div>
        ) : null} */}
        <div className='feed-grid'>
          {feeds.map((feed) => (
            <Feed key={feed.id} feed={feed} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ViewOwnFeeds
