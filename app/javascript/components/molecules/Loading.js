import React from 'react'
import Spinner from '../atoms/Spinner'

const Loading = ({
  children,
  isLoading = false,
  renderChildrenWhileLoading = true,
  loaderViewHeight = null
}) => {
  const loaderHeightWrapperStyle = loaderViewHeight ? { height: loaderViewHeight } : null
  const renderChildren = !isLoading || renderChildrenWhileLoading
  return (
    <div className={'loading-panel' + (isLoading ? ' loading' : '')}>
      {isLoading && (
        <div style={loaderHeightWrapperStyle}>
          <Spinner />
        </div>
      )}
      {renderChildren && children}
    </div>
  )
}

export default Loading
