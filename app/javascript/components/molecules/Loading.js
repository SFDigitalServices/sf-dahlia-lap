import React from 'react'
import Spinner from '../atoms/Spinner'

const Loading = ({ children, isLoading }) => {
  return (
    <div className={'loading-panel' + (isLoading ? ' loading' : '')}>
      { isLoading ? <Spinner /> : null }
      { children }
    </div>
  )
}

export default Loading
