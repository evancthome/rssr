import { useState } from 'react'
import { supabase } from '../supabaseClient'

const AddFeed = ({ getFeeds, setAddOpen }) => {
  const [title, setTitle] = useState(null)
  const [link, setLink] = useState(null)
  const [isPublic, setIsPublic] = useState(false)
  const [loading, setLoading] = useState(false)

  const addFeed = async () => {
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
      setTitle('')
      setLink('')
      setIsPublic(false)
      getFeeds()
    }
  }

  return (
    <div className='feed-form'>
      {/* <h3>Add Feed</h3> */}
      <div>
        <label htmlFor='Name'>Name</label>
        <input
          className='input'
          type='text'
          value={title || ''}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor='URL'>Link</label>
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
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
      </div> */}
      <div className='split'>
        <button className='btn' onClick={addFeed} disabled={loading}>
          Add
        </button>
        <button
          className='btn'
          onClick={() => setAddOpen(false)}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default AddFeed
