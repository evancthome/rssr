import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { parseString } from 'xml2js'
import Feed from './Feed'

const ViewOwnFeeds = ({ session }) => {
  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(true)

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
      // .limit(2)

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

  // const parseFeed = async (url) => {
  //   const encodedUrl = encodeURI(url)
  //   const data = await fetch(corsProxy + encodedUrl)
  //   const dataToText = data.text()
  //   const parsed = new window.DOMParser().parseFromString(
  //     dataToText,
  //     'text/xml',
  //   )

  //   return parsed.item
  // }

  const addParsedFeed = async (feedArr) => {
    for (let feed of feedArr) {
      const data = await fetch(corsProxy + feed.url)
      const textData = await data.text()
      parseString(textData, (err, result) => (feed.rss = result))
      // feed.rss = parsed
      // const parsed = new DOMParser().parseFromString(textData, 'text/xml')
      // feed.rss = parsed.querySelector('channel')
    }
    setFeeds(feedArr)
    setLoading(false)
  }

  return (
    <div className='w-full min-h-screen col-span-3 col-start-2 px-16 pt-4'>
      <h1 className='mb-6 text-4xl font-bold text-center'>Feeds</h1>
      <div>
        {!loading
          ? feeds.map((feed) => (
              <div key={feed.id}>
                <Feed feed={feed} />
              </div>
            ))
          : 'none to display'}
      </div>
    </div>
  )
}

export default ViewOwnFeeds
