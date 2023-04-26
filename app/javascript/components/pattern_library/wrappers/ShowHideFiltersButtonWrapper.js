import React from 'react'

import ShowHideFiltersButton from 'components/molecules/ShowHideFiltersButton'

const ShowHideFiltersButtonWrapper = () => {
  return (
    <>
      <h3>With no filters applied</h3>
      <ShowHideFiltersButton isShowingFilters numFiltersApplied={0} />
      <div />
      <ShowHideFiltersButton numFiltersApplied={0} />

      <h3>With one filter applied</h3>
      <ShowHideFiltersButton isShowingFilters numFiltersApplied={1} />
      <div />
      <ShowHideFiltersButton numFiltersApplied={1} />

      <h3>With 8 filters applied</h3>
      <ShowHideFiltersButton isShowingFilters numFiltersApplied={8} />
      <div />
      <ShowHideFiltersButton numFiltersApplied={8} />
    </>
  )
}

export default ShowHideFiltersButtonWrapper
