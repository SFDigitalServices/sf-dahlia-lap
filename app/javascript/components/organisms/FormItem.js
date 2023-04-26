import React from 'react'

import FormGrid from 'components/molecules/FormGrid'

const FormItem = ({ label, children }) => (
  <FormGrid.Item>
    <FormGrid.Group label={label}>{children}</FormGrid.Group>
  </FormGrid.Item>
)

export default FormItem
