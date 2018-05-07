import React from 'react'
import renderer from 'react-test-renderer'
import BreadCrumbs from 'components/atoms/BreadCrumbs'
import sinon from 'sinon'

describe('BreadCrumbs', () => {
  let items = [
    { title: 'Alpha', link: '/alpah' },
    { title: 'Beta', link: '/beta' },
    { title: 'Gama', link: '/gama' },
    { title: 'Pi', link: '/pi' }
  ]

  test('should render succesfully', () => {
    const component = renderer.create(
      <BreadCrumbs items={items} />,
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })
})
