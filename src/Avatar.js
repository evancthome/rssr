import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

const Avatar = ({ url, onUpload }) => {
  const [avatarUrl, setAvatarUrl] = useState()
  const [uploading, setUploading] = useState()

  useEffect(() => {
    if (url) downloadImage(url)
  }, [url])

  const downloadImage = async (path) => {
    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .download(path)
      if (error) {
        throw error
      }
      const url = URL.createObjectURL(data)
      setAvatarUrl(url)
    } catch (error) {
      console.log('Error downloading image: ', error.message)
    }
  }

  const uploadAvatar = async (e) => {
    try {
      setUploading(true)

      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      let { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      onUpload(filePath)
    } catch (error) {
      alert.apply(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {avatarUrl ? (
        <img
          style={{
            maskImage:
              'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+)',
            maskSize: 'contain',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
          }}
          className='w-24 h-24'
          src={avatarUrl}
          alt='Avatar'
        />
      ) : (
        <div>No avatar</div>
      )}
      <div className='mt-6 mb-2'>
        <label
          className='px-4 py-2 text-white rounded cursor-pointer bg-slate-600 hover:bg-slate-500'
          htmlFor='single'
        >
          {uploading ? 'Uploading' : 'Upload'}
        </label>
        <input
          type='file'
          className='absolute invisible'
          id='single'
          accept='image/*'
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  )
}

export default Avatar
