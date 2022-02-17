import { useEffect, useState } from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { IoReloadSharp } from 'react-icons/io5'
import { MdDeleteForever } from 'react-icons/md'
import { IconContext } from 'react-icons/lib'
import Loader from './Loader'
import FeedItem from './FeedItem'
import Confirmation from './Confirmation'
import UpdateFeed from './UpdateFeed'
import { supabase } from '../supabaseClient'

const ViewFeed = ({ accountOpen, getFeeds, addParsedFeed }) => {
  const [feed, setFeed] = useState([])
  const [updateOpen, setUpdateOpen] = useState(false)
  const [loading, setLoading] = useState()
  const [showConfirm, setShowConfirm] = useState(false)

  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    getFeed(params.id)
  }, [params.id])

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
    // if (!showConfirm) {
    //   document.querySelector('body').classList.add('overflow-hidden')
    // }
    // if (showConfirm) {
    //   document.querySelector('body').classList.remove('overflow-hidden')
    // }
    setShowConfirm(!showConfirm)
  }

  return (
    <div
      className={
        !accountOpen
          ? 'w-full min-h-screen row-start-1 overflow-y-hidden col-span-3 col-start-1 px-4 pt-4 md:px-16  '
          : 'w-full min-h-screen row-start-1 overflow-y-hidden col-span-3 px-4 pt-4 md:px-16 col-start-2 '
      }
    >
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
      <div className='grid grid-cols-3 grid-rows-2 mb-6 sm:grid-rows-1 gap-y-4 place-items-end'>
        <IconContext.Provider
          value={loading ? { className: 'animate-spin' } : ''}
        >
          <button
            className='px-4 py-2 mx-2 text-white rounded cursor-pointer w-min bg-slate-600 hover:bg-slate-500'
            onClick={() => {
              getFeed(params.id)
            }}
          >
            {<IoReloadSharp size={20} />}
          </button>
        </IconContext.Provider>
        <div className='grid grid-cols-3 col-span-4 col-start-1 row-start-2 sm:row-start-1 sm:col-start-2 sm:place-self-start place-self-center place-items-center'>
          <button
            onClick={toggleUpdate}
            className='px-4 py-2 text-white rounded cursor-pointer w-max bg-slate-600 hover:bg-slate-500 h-min'
          >
            Update Info
          </button>
          <h1 className='inline font-mono text-4xl font-bold text-center text-cyan-700'>
            {feed.name ? feed.name : ''}
          </h1>
          <button
            className='p-2 ml-2 text-white bg-red-600 rounded-full hover:bg-red-500 w-min h-min place-self-start'
            onClick={toggleConfirm}
          >
            <MdDeleteForever size={20} />
          </button>
        </div>
        <Link
          to='/'
          className='col-start-3 row-start-1 px-4 py-2 mx-2 text-white rounded cursor-pointer place-self-end w-min bg-slate-600 hover:bg-slate-500'
        >
          Back
        </Link>
      </div>
      <div>
        <div className={updateOpen ? 'flex justify-center' : 'hidden'}>
          <UpdateFeed
            getFeed={getFeed}
            getFeeds={getFeeds}
            feed={feed}
            id={params.id}
            setUpdateOpen={setUpdateOpen}
          />
        </div>
        {!feed.rss ? (
          <div className='flex items-center justify-center min-h-screen'>
            <Loader />
          </div>
        ) : (
          feed.rss.rss.channel[0].item.map((i) => (
            <FeedItem key={i.title} i={i} displayName={false} />
          ))
        )}
      </div>
    </div>
  )
}

export default ViewFeed
