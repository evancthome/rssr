import { useEffect, useState } from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { IoReloadSharp } from 'react-icons/io5'
import { MdDeleteForever } from 'react-icons/md'
import { IconContext } from 'react-icons/lib'
import { slide as Menu } from 'react-burger-menu'
import Loader from './Loader'
import FeedItem from './FeedItem'
import Confirmation from './Confirmation'
import UpdateFeed from './UpdateFeed'
import Avatar from './Avatar'
import Account from './Account'
import { supabase } from '../supabaseClient'

const ViewFeed = ({ session, username, avatar, getFeeds, addParsedFeed }) => {
  const itemsPerPage = 20

  const [feed, setFeed] = useState([])
  const [updateOpen, setUpdateOpen] = useState(false)
  const [loading, setLoading] = useState()
  const [showConfirm, setShowConfirm] = useState(false)
  const [itemNumber, setItemNumber] = useState(itemsPerPage)
  const [showAccount, setShowAccount] = useState(false)

  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    getFeed(params.id)
  }, [params.id])

  const handleScroll = () => {
    let isAtBottom =
      document.documentElement.scrollHeight -
        document.documentElement.scrollTop <=
      document.documentElement.clientHeight

    if (isAtBottom) {
      setItemNumber(itemNumber + itemsPerPage)
    }
  }

  const getFeed = async (id) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('feeds')
        .select()
        .eq('id', id)
        .single()

      if (error) {
        throw error
      }
      if (data) {
        const dArr = [data]
        addParsedFeed(dArr).then((p) => setFeed(p[0]))
      }
    } catch (error) {
      console.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async (id) => {
    setLoading(true)
    try {
      const { error } = await supabase.from('feeds').delete().eq('id', id)

      if (error) {
        throw error
      }
    } catch (error) {
      console.error(error.message)
    } finally {
      setLoading(false)
      getFeeds()
      navigate('/')
    }
  }

  const toggleUpdate = () => {
    setUpdateOpen(!updateOpen)
  }

  const toggleConfirm = () => {
    if (!showConfirm) {
      document.querySelector('body').classList.add('overflow-hidden')
    }
    if (showConfirm) {
      document.querySelector('body').classList.remove('overflow-hidden')
    }
    setShowConfirm(!showConfirm)
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

  window.addEventListener('scroll', handleScroll)

  return (
    <div>
      {showConfirm ? (
        <Confirmation
          body={`Do you really want to delete ${feed.name} from your feed list?`}
          btnText='Delete'
          submitF={() => {
            onDelete(params.id)
          }}
          toggleF={toggleConfirm}
        />
      ) : null}
      <Menu>
        <h2>RSSr</h2>
        <Avatar url={avatar} />
        <p className='username'>{username}</p>

        <Link to='/' className='menu-item'>
          Home
        </Link>
        <Link to='/recent' className='menu-item'>
          Most Recent
        </Link>
        <button onClick={onToggleAccount}>View Account</button>
        {!updateOpen ? <button onClick={toggleUpdate}>Update</button> : null}

        {updateOpen ? (
          <UpdateFeed
            getFeed={getFeed}
            getFeeds={getFeeds}
            feed={feed}
            id={params.id}
            setUpdateOpen={setUpdateOpen}
          />
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
        <div className='header'>
          <IconContext.Provider
            value={loading ? { className: 'animate-spin' } : ''}
          >
            <button
              className='header-item'
              onClick={() => {
                getFeed(params.id)
              }}
            >
              {<IoReloadSharp size={20} />}
            </button>
          </IconContext.Provider>
          <div className='split'>
            <h1 className='inline font-mono text-4xl font-bold text-center text-cyan-700'>
              {feed.name ? feed.name : ''}
            </h1>
            <button className='delete' onClick={toggleConfirm}>
              <MdDeleteForever size={20} />
            </button>
          </div>
          <Link to='/' className='header-item'>
            Back
          </Link>
        </div>
        <div>
          <div className='view-feed'>
            {!feed.rss ? (
              <div className='flex items-center justify-center min-h-screen'>
                <Loader />
              </div>
            ) : (
              feed.rss.rss.channel[0].item
                .slice(0, itemNumber)
                .map((i) => (
                  <FeedItem
                    img={
                      feed.rss.rss.channel[0].image
                        ? feed.rss.rss.channel[0].image[0].url
                        : null
                    }
                    key={i.title}
                    i={i}
                    displayName={false}
                  />
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewFeed
