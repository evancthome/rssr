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
    <div className='feed-form'>
      {/* <h3 className='mb-2 text-lg font-bold text-center'>Update Feed</h3> */}
      <div>
        <label className='font-semibold' htmlFor='Name'>
          Name
        </label>
        <input
          className='input'
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
          className='input'
          type='text'
          value={link || ''}
          onChange={(e) => setLink(e.target.value)}
        />
      </div>
      {/* <div className='mb-2'>
        <label htmlFor='Name'>Is this a public feed?</label>
        <input
          className='ml-4'
          type='checkbox'
          checked={!!isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
      </div> */}
      <div className='split'>
        <button className='btn' onClick={updateFeed} disabled={loading}>
          Update
        </button>
        <button
          className='btn'
          onClick={() => setUpdateOpen(false)}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default UpdateFeed
