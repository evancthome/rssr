import React, { useState, useEffect, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { parseString } from 'xml2js'
import Loader from './Loader'
import AddFeed from './AddFeed'
const Feed = React.lazy(() => import('./Feed'))

const ViewOwnFeeds = ({ session }) => {
  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)

  const corsProxy = 'https://long-mouse-41.deno.dev/?target='

  useEffect(() => {
    getFeeds()
  }, [session])

  const getFeeds = async () => {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      let { data, error, status } = await supabase
        .from('feeds')
        .select('*')
        .eq('user_id', user.id)

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        addParsedFeed(data).then(setFeeds(addParsedFeed))
      }
    } catch (error) {
      alert(error.message)
    }
  }

  const addParsedFeed = async (feedArr) => {
    for (let feed of feedArr) {
      const data = await fetch(corsProxy + feed.url)
      const textData = await data.text()
      parseString(textData, (err, result) => (feed.rss = result))
    }
    setFeeds(feedArr)
    setLoading(false)
  }

  const onToggleAdd = () => {
    setAddOpen(!addOpen)
  }

  return (
    <div className='w-full min-h-screen col-span-4 col-start-1 px-4 pt-4 md:px-16 md:col-start-2 md:col-span-3'>
      <div className='flex items-center justify-between mb-6'>
        <button
          onClick={onToggleAdd}
          className='px-4 py-2 mx-2 text-white rounded cursor-pointer bg-slate-600 hover:bg-slate-500'
        >
          Add Feed
        </button>
        <h1 className='font-mono text-4xl font-bold text-center text-cyan-700'>
          Feeds
        </h1>
        <Link
          to='/recent'
          className='px-4 py-2 mx-2 text-white rounded cursor-pointer bg-slate-600 hover:bg-slate-500'
        >
          View Most Recent
        </Link>
      </div>
      <div className={addOpen ? 'flex justify-center' : 'hidden'}>
        <AddFeed getFeeds={getFeeds} setAddOpen={setAddOpen} />
      </div>
      <div>
        {!loading ? (
          feeds.map((feed) => (
            <Suspense key={feed.id} fallback={<Loader />}>
              <div>
                <Feed feed={feed} />
              </div>
            </Suspense>
          ))
        ) : (
          <span className='flex items-center justify-center'>
            <Loader />
          </span>
        )}
      </div>
    </div>
  )
}

export default ViewOwnFeeds
