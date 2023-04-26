import React from 'react'

import { shallow } from 'enzyme'

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

const getWrapper = ({ hasParkingSpace = false, isMonthlyRentVisited = false, disabled = false }) =>
  shallow(
    <ParkingInformationInputs
      form={mockForm(isMonthlyRentVisited)}
      values={mockFormValues(hasParkingSpace)}
      disabled={disabled}
    />
  )

describe('ParkingInformationInputs', () => {
  describe('when hasParkingSpace is false', () => {
    let wrapper
    beforeEach(() => {
      wrapper = getWrapper({ hasParkingSpace: false })
    })

    test('should render the "is parking space assigned" field', () => {
      expect(wrapper.find({ label: 'BMR Parking Space Assigned?' })).toHaveLength(1)
    })

    test('should not render the parking cost field"', () => {
      expect(wrapper.find({ label: 'Monthly Cost' })).toHaveLength(0)
    })

    test('should not render assigned space fields', () => {
      expect(wrapper.find({ label: 'Space Assigned' })).toHaveLength(0)
    })

    test('should not render field as disabled when disabled is false', () => {
      expect(wrapper.find({ label: 'BMR Parking Space Assigned?' }).props().disabled).toBeFalsy()
    })

    test('should render fields as disabled when disabled is true', () => {
      const wrapper = getWrapper({ hasParkingSpace: true, disabled: true })
      expect(wrapper.find({ label: 'BMR Parking Space Assigned?' }).props().disabled).toBeTruthy()
    })
  })

  describe('when hasParkingSpace is true', () => {
    let wrapper
    beforeEach(() => {
      wrapper = getWrapper({ hasParkingSpace: true })
    })

    test('should render the "is parking space assigned" field', () => {
      expect(wrapper.find({ label: 'BMR Parking Space Assigned?' })).toHaveLength(1)
    })

    test('should render the parking cost field"', () => {
      expect(wrapper.find({ label: 'Monthly Cost' })).toHaveLength(1)
    })

    test('should render assigned space fields', () => {
      expect(wrapper.find({ label: 'Space Assigned' })).toHaveLength(1)
    })

    test('should not render fields as disabled', () => {
      expect(wrapper.find({ label: 'BMR Parking Space Assigned?' }).props().disabled).toBeFalsy()
      expect(wrapper.find({ label: 'Monthly Cost' }).props().disabled).toBeFalsy()
      expect(wrapper.find({ label: 'Space Assigned' }).props().disabled).toBeFalsy()
    })

    test('should not render any fields as dirty', () => {
      expect(wrapper.find({ label: 'BMR Parking Space Assigned?' }).props().dirty).toBeUndefined()
      expect(wrapper.find({ label: 'Monthly Cost' }).props().dirty).toBeFalsy()
      expect(wrapper.find({ label: 'Space Assigned' }).props().dirty).toBeFalsy()
    })

    describe('when disabled is true', () => {
      let wrapper
      beforeEach(() => {
        wrapper = getWrapper({ hasParkingSpace: true, disabled: true })
      })

      test('should render fields as disabled', () => {
        expect(wrapper.find({ label: 'BMR Parking Space Assigned?' }).props().disabled).toBeTruthy()
        expect(wrapper.find({ label: 'Monthly Cost' }).props().disabled).toBeTruthy()
        expect(wrapper.find({ label: 'Space Assigned' }).props().disabled).toBeTruthy()
      })
    })

    describe('when the monthly rent field has been visited', () => {
      let wrapper
      beforeEach(() => {
        wrapper = getWrapper({ hasParkingSpace: true, isMonthlyRentVisited: true })
      })

      test('should not render parking space assigned as dirty', () => {
        expect(
          wrapper.find({ label: 'BMR Parking Space Assigned?' }).props().isDirty
        ).toBeUndefined()
      })

      test('should render cost and space assigned as dirty', () => {
        expect(wrapper.find({ label: 'Monthly Cost' }).props().isDirty).toBeTruthy()
        expect(wrapper.find({ label: 'Space Assigned' }).props().isDirty).toBeTruthy()
      })
    })
  })
})
