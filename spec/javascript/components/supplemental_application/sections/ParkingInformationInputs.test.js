import React from 'react'

import { render, screen } from '@testing-library/react'
import { Form } from 'react-final-form'

import ParkingInformationInputs from 'components/supplemental_application/sections/ParkingInformationInputs'

const mockChangeFn = jest.fn()

const mockFormValues = (hasParkingSpace = true) => ({
  lease: { bmr_parking_space_assigned: hasParkingSpace ? 'Yes' : 'No' }
})

const mockForm = (isMonthlyRentVisited) => ({
  change: (name, value) => mockChangeFn(name, value),
  getFieldState: (fieldName) => ({
    visited: isMonthlyRentVisited
  })
})

const onSubmitMock = (values) => {}

const getScreen = ({ hasParkingSpace = false, isMonthlyRentVisited = false, disabled = false }) =>
  render(
    <Form onSubmit={onSubmitMock}>
      {() => (
        <form>
          <ParkingInformationInputs
            form={mockForm(isMonthlyRentVisited)}
            values={mockFormValues(hasParkingSpace)}
            disabled={disabled}
          />
        </form>
      )}
    </Form>
  )

describe('ParkingInformationInputs', () => {
  describe('when hasParkingSpace is false', () => {
    beforeEach(() => {
      getScreen({ hasParkingSpace: false })
    })

    test('should render the "is parking space assigned" field', () => {
      expect(screen.getByText('BMR Parking Space Assigned?')).toBeInTheDocument()
    })

    test('should not render the parking cost field"', () => {
      expect(screen.queryByText('Monthly Cost')).not.toBeInTheDocument()
    })

    test('should not render assigned space fields', () => {
      expect(screen.queryByText('Space Assigned')).not.toBeInTheDocument()
    })

    test('should not render field as disabled when disabled is false', () => {
      expect(screen.getByText('BMR Parking Space Assigned?')).toBeEnabled()
    })
  })

  test('should render fields as disabled when disabled is true and hasParkingSpace is true', () => {
    getScreen({ hasParkingSpace: true, disabled: true })
    // This combobox is the "BMR Parking Space Assigned?" field
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  describe('when hasParkingSpace is true', () => {
    beforeEach(() => {
      getScreen({ hasParkingSpace: true })
    })

    test('should render the "is parking space assigned" field', () => {
      expect(screen.getByText('BMR Parking Space Assigned?')).toBeInTheDocument()
    })

    test('should render the parking cost field"', () => {
      expect(screen.getByText('Monthly Cost')).toBeInTheDocument()
    })

    test('should render assigned space fields', () => {
      expect(screen.getByText('Space Assigned')).toBeInTheDocument()
    })

    test('should not render fields as disabled', () => {
      expect(
        screen.getByRole('combobox', {
          name: /bmr parking space assigned\?/i
        })
      ).toBeEnabled()
      expect(
        screen.getByRole('textbox', {
          name: /monthly cost/i
        })
      ).toBeEnabled()
      expect(
        screen.getByRole('textbox', {
          name: /space assigned/i
        })
      ).toBeEnabled()
    })

    test('should not render any fields as dirty', () => {
      expect(
        screen.getByRole('combobox', {
          name: /bmr parking space assigned\?/i
        })
      ).toHaveValue('')
      expect(
        screen.getByRole('textbox', {
          name: /monthly cost/i
        })
      ).toHaveValue('')
      expect(
        screen.getByRole('textbox', {
          name: /space assigned/i
        })
      ).toHaveValue('')
    })
  })

  describe('when disabled is true', () => {
    beforeEach(() => {
      getScreen({ hasParkingSpace: true, disabled: true })
    })

    test('should render fields as disabled', () => {
      expect(
        screen.getByRole('combobox', {
          name: /bmr parking space assigned\?/i
        })
      ).toBeDisabled()
      expect(
        screen.getByRole('textbox', {
          name: /monthly cost/i
        })
      ).toBeDisabled()
      expect(
        screen.getByRole('textbox', {
          name: /space assigned/i
        })
      ).toBeDisabled()
    })
  })

  describe('when the monthly rent field has been visited', () => {
    beforeEach(() => {
      getScreen({ hasParkingSpace: true, isMonthlyRentVisited: true })
    })

    test('should not render parking space assigned as dirty', () => {
      expect(
        screen.getByRole('combobox', {
          name: /bmr parking space assigned\?/i
        })
      ).toHaveValue('')
    })
  })
})
