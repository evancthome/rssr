import { useState } from 'react'
import { supabase } from '../supabaseClient'

const AddFeed = ({ getFeeds, setAddOpen }) => {
  const [title, setTitle] = useState(null)
  const [link, setLink] = useState(null)
  const [isPublic, setIsPublic] = useState(false)
  const [loading, setLoading] = useState(false)

  const addFeed = async ({ name, url, publicFeed }) => {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      const fields = [
        {
          user_id: user.id,
          name: title,
          url: link,
          public: isPublic,
        },
      ]

      let { error } = await supabase.from('feeds').insert(fields, {
        returning: 'minimal',
      })

      if (error) {
        throw error
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
      setAddOpen(false)
      getFeeds()
    }
  }

  return (
    <div className='flex flex-col items-center w-1/2 p-4 mx-auto mb-4 rounded shadow bg-slate-300'>
      <h3 className='mb-2 text-lg font-bold text-center'>Add Feed</h3>
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
          value={isPublic || ''}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
      </div>
      <div>
        <button
          className='px-4 py-2 mx-2 text-white rounded cursor-pointer bg-slate-700 hover:bg-slate-600'
          onClick={addFeed}
        >
          Add Feed
        </button>
      </div>
    </div>
  )
}

export default AddFeed
