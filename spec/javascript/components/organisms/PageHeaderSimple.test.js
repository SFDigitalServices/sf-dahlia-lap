import React from 'react'
import renderer from 'react-test-renderer'
import PageHeaderSimple from 'components/organisms/PageHeaderSimple'
import sinon from 'sinon'

describe('PageHeaderSimple', () => {
  let title = "title1"

  test('should render succesfully', () => {
    const component = renderer.create(
      <PageHeaderSimple title={title} />,
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })
})
