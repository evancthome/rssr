import React, { useState } from 'react'
import he from 'he'
import { IoIosArrowDown } from 'react-icons/io'
import { IoIosArrowUp } from 'react-icons/io'
import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'
import parse from 'html-react-parser'
import DOMPurify from 'dompurify'

const FeedItem = ({ i, displayName }) => {
  const [viewDes, setViewDes] = useState(false)

  const onClick = () => {
    setViewDes(!viewDes)
  }

  const html = (html) => {
    return parse(DOMPurify.sanitize(html))
  }
  return (
    <div className='px-4 py-2 mb-4 rounded shadow bg-slate-300'>
      <a
        className='inline-block text-lg font-bold hover:text-slate-600 text-cyan-700'
        href={i.link}
        target='_blank'
        rel='noreferrer'
      >
        {i.title ? i.title : i.description}
      </a>
      <div className='flex justify-between'>
        <p className='font-semibold'>
          Published {displayName ? `by ${i.name}` : ''} on{' '}
          {new Date(i.pubDate).toDateString()}
        </p>
        <button onClick={onClick}>
          {viewDes ? <IoIosArrowDown size={25} /> : <IoIosArrowUp size={25} />}
        </button>
      </div>

      <div className={viewDes ? 'block' : 'hidden'}>
        {i.enclosure ? <AudioPlayer src={i.enclosure[0].$.url} /> : ''}
        {html(he.decode(i.description.toString()))}
      </div>
    </div>
  )
}

export default FeedItem
