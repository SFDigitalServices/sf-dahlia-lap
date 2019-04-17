import React from 'react'
import renderer from 'react-test-renderer'
import PreferencesTable from '~/components/supplemental_application/sections/PreferencesTable'
import application from '../../../fixtures/domain_application'

const applicationMembers = [{id: 'a0n0x000000AbE6AAK', first_name: 'karen', last_name: 'jones'}]
const fileBaseUrl = 'https://test.force.com'
const onSave = () => {}
const onDismissError = () => {}
const formApi = {}

describe('PreferencesTable', () => {
  test('should render a table of only preferences that the application receives (Receives_Preference = true) ', () => {
    // const context = cloneDeep(baseContext)
    const component = renderer.create(
      <PreferencesTable
        application={application}
        applicationMembers={applicationMembers}
        onSave={onSave}
        fileBaseUrl={fileBaseUrl}
        onPanelClose={onDismissError}
        formApi={formApi}
      />
    )

    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
