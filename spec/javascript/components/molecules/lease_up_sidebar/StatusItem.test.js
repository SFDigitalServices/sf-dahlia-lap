import React from 'react'

import { render, screen } from '@testing-library/react'

import StatusItem from 'components/molecules/lease_up_sidebar/StatusItem'

import { mockStatusItem } from '../../../mocks/statusItemMock'

const getScreen = (item) => render(<StatusItem statusItem={item} />)

describe('StatusItem', () => {
  test('should render an approved status with substatus and comments correctly', () => {
    const { asFragment } = getScreen(mockStatusItem())
    expect(asFragment()).toMatchSnapshot()
  })

  test('should render properly when no substatus provided', () => {
    const { asFragment } = getScreen(mockStatusItem({ substatus: null }))
    expect(asFragment()).toMatchSnapshot()
  })

  test('should render properly when no comment provided', () => {
    const { asFragment } = getScreen(mockStatusItem({ comment: null }))
    expect(asFragment()).toMatchSnapshot()
  })

  test('should render properly when no comment or substatus provided', () => {
    const { asFragment } = getScreen(mockStatusItem({ substatus: null, comment: null }))
    expect(asFragment()).toMatchSnapshot()
  })

  test('should render properly with withdrawn status', () => {
    const { asFragment } = getScreen(mockStatusItem({ status: 'Withdrawn', substatus: null }))
    expect(asFragment()).toMatchSnapshot()
  })

  test('should render properly with Processing status', () => {
    const { asFragment } = getScreen(mockStatusItem({ status: 'Processing', substatus: null }))
    expect(asFragment()).toMatchSnapshot()
  })

  test('should render properly with Appealed status', () => {
    const { asFragment } = getScreen(mockStatusItem({ status: 'Appealed', substatus: null }))
    expect(asFragment()).toMatchSnapshot()
  })

  test('should render properly with Disqualified status', () => {
    const { asFragment } = getScreen(mockStatusItem({ status: 'Disqualified', substatus: null }))
    expect(asFragment()).toMatchSnapshot()
  })

  test('should render properly with Lease Signed status', () => {
    const { asFragment } = getScreen(mockStatusItem({ status: 'Lease Signed', substatus: null }))
    expect(asFragment()).toMatchSnapshot()
  })

  test('should format timestamps as expected', () => {
    render(<StatusItem statusItem={mockStatusItem({ status: 'Lease Signed', substatus: null })} />)
    expect(screen.getByText('Aug 25, 2020 8:00 pm')).toBeInTheDocument()
  })
})
