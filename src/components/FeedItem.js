import React, { useState } from 'react'
import he from 'he'
import { IoIosArrowDown } from 'react-icons/io'
import { IoIosArrowUp } from 'react-icons/io'
import AudioPlayer from 'react-h5-audio-player'
import '../audioplayer.css'
import parse from 'html-react-parser'
import DOMPurify from 'dompurify'

const FeedItem = ({ i, displayName, name, img }) => {
  const [viewDes, setViewDes] = useState(false)

  const onClick = () => {
    setViewDes(!viewDes)
  }

  const html = (html) => {
    return parse(DOMPurify.sanitize(html))
  }
  let imgSrc

  if (i['itunes:image']) imgSrc = i['itunes:image'][0].$.href
  else if (img) imgSrc = img
  else if (i.img) imgSrc = i.img[0]

  return (
    <div className='feed-item'>
      <img src={imgSrc} alt='' />
      <div className='feed-item-content'>
        <a
          className='inline-block text-lg font-bold hover:text-slate-600 text-cyan-700'
          href={i.link}
          target='_blank'
          rel='noreferrer'
        >
          {i.title ? i.title : i.description}
        </a>

        <p className='font-semibold'>
          Published {name ? `by ${name}` : ''}{' '}
          {displayName ? `by ${i.name}` : ''} on{' '}
          {new Date(i.pubDate).toDateString()}
        </p>
        <button onClick={onClick}>
          {!viewDes ? <IoIosArrowDown size={25} /> : <IoIosArrowUp size={25} />}
        </button>
      </div>

      <div className={viewDes ? 'feed-item-desc' : 'hidden feed-item-desc'}>
        {i.enclosure ? <AudioPlayer src={i.enclosure[0].$.url} /> : ''}
        {html(he.decode(i.description.toString()))}
      </div>
    </div>
  )
}

export default FeedItem
