import React, { useState, useRef, useEffect } from 'react'

import { useSearchParams, useLocation } from 'react-router-dom'

import { EagerPagination, SERVER_PAGE_SIZE } from 'utils/EagerPagination'

import ApplicationsFilter from './ApplicationsFilter'
import ApplicationsTable from './ApplicationsTable'

const ROWS_PER_PAGE = 20

const ApplicationsTableContainer = ({ onFetchData, listings, filters: initialFilters = {} }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const eagerPaginationRef = useRef(new EagerPagination(ROWS_PER_PAGE, SERVER_PAGE_SIZE))

  const [state, setState] = useState({
    filters: initialFilters,
    loading: false,
    applications: [],
    pages: 0,
    atMaxPages: false
  })

  const loadPage = (page, filters) => {
    const fetcher = (p) => onFetchData(p, { filters })
    setState((prev) => ({ ...prev, loading: true, page }))
    eagerPaginationRef.current.getPage(page, fetcher).then(({ records, pages }) => {
      setState((prev) => ({
        ...prev,
        applications: records,
        loading: false,
        pages,
        atMaxPages: false
      }))
    })
  }

  const handleOnFetchData = (tableState) => {
    if (eagerPaginationRef.current.isOverLimit(tableState.page)) {
      setState((prev) => ({ ...prev, applications: [], loading: false, atMaxPages: true }))
    } else {
      handlePageChange(tableState.page)
    }
  }

  const handleOnFilter = (filters) => {
    setState((prev) => ({ ...prev, filters }))
    eagerPaginationRef.current.reset()

    // Reset to page 1 when filters change
    const newParams = new URLSearchParams(searchParams)
    newParams.set('page', '1')

    // Update filter parameters in URL
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        newParams.set(key, filters[key])
      } else {
        newParams.delete(key)
      }
    })

    setSearchParams(newParams)
  }

  // Read page from URL (1-indexed) and convert to 0-indexed
  const urlPage = parseInt(searchParams.get('page') || '1', 10)
  const currentPage = isNaN(urlPage) ? 0 : Math.max(0, urlPage - 1)

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('page', (newPage + 1).toString())
    setSearchParams(newParams)
  }

  // Load data when component mounts or URL page changes
  useEffect(() => {
    const { filters } = state
    if (eagerPaginationRef.current.isOverLimit(currentPage)) {
      setState((prev) => ({ ...prev, applications: [], loading: false, atMaxPages: true }))
      return
    }
    loadPage(currentPage, filters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, currentPage])

  const { loading, applications, pages, atMaxPages } = state

  return (
    <>
      <ApplicationsFilter onSubmit={handleOnFilter} listings={listings} loading={loading} />
      <ApplicationsTable
        applications={applications}
        onFetchData={handleOnFetchData}
        pages={pages}
        loading={loading}
        rowsPerPage={ROWS_PER_PAGE}
        atMaxPages={atMaxPages}
      />
    </>
  )
}

export default ApplicationsTableContainer
