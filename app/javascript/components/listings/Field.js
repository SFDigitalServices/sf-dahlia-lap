import React from 'react'

var generateHtml = (value) => {
  return { __html: value }
}

const RenderType = ({ type, value }) => {
  if (type === 'html') {
    return <p dangerouslySetInnerHTML={generateHtml(value)} />
  } else if (type === 'link') {
    return (
      <a target='_blank' rel='noreferrer' href={value}>
        {value}
      </a>
    )
  } else {
    return <p>{String(value)}</p>
  }
}

const Content = ({ label, value, type }) => {
  return (
    <div className='margin-bottom--half'>
      <h4 className='t-sans t-small t-bold no-margin'>{label}</h4>
      <RenderType type={type} value={value} />
    </div>
  )
}

export default Content
