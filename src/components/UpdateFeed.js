import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

const UpdateFeed = ({ getFeeds, getFeed, feed, id, setUpdateOpen }) => {
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setFeed()
  }, [feed])

  const setFeed = () => {
    setTitle(feed.name)
    setLink(feed.url)
    setIsPublic(feed.public)
  }

  const updateFeed = async () => {
    try {
      setLoading(true)

      const updates = [
        {
          id: id,
          name: title,
          url: link,
          public: isPublic,
        },
      ]

      let { error } = await supabase
        .from('feeds')
        .update(updates, {
          returning: 'minimal',
        })
        .eq('id', id)

      if (error) {
        throw error
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
      setUpdateOpen(false)
      getFeed(id)
      getFeeds()
    }
  }

  return (
    <div className='flex flex-col items-center w-full p-4 mx-auto mb-4 rounded shadow sm:w-1/2 bg-slate-300'>
      <h3 className='mb-2 text-lg font-bold text-center'>Update Feed</h3>
      <div className='mb-2'>
        <label className='font-semibold' htmlFor='Name'>
          Name
        </label>
        <input
          className='w-full rounded'
          type='text'
          value={title || ''}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label className='font-semibold' htmlFor='URL'>
          Link
        </label>
        <input
          className='w-full rounded'
          type='text'
          value={link || ''}
          onChange={(e) => setLink(e.target.value)}
        />
      </div>
      <div className='mb-2'>
        <label htmlFor='Name'>Is this a public feed?</label>
        <input
          className='ml-4'
          type='checkbox'
          checked={!!isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
      </div>
      <div>
        <button
          className='px-4 py-2 mx-2 text-white rounded cursor-pointer bg-slate-700 hover:bg-slate-600'
          onClick={updateFeed}
          disabled={loading}
        >
          Update Feed
        </button>
      </div>
    </div>
  )
}

export default UpdateFeed
