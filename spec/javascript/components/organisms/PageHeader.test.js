import React from 'react'
import renderer from 'react-test-renderer'
import PageHeader from 'components/organisms/PageHeader'

describe('PageHeader', () => {
  const title = 'title1'
  const content = 'content1'
  const breadcrumbs = [
    { title: 'Alpha', link: '/alpah' },
    { title: 'Beta', link: '/beta' },
    { title: 'Gama', link: '/gama' },
    { title: 'Pi', link: '/pi' }
  ]
  const action = { link: '/export', title: 'Export' }

  test('should render succesfully', () => {
    const component = renderer.create(
      <PageHeader title={title} content={content} action={action} breadcrumbs={breadcrumbs} />
    )

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('should render succesfully without BreadCrumbs', () => {
    const component = renderer.create(
      <PageHeader title={title} content={content} action={action} />
    )

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('should render succesfully without action', () => {
    const component = renderer.create(
      <PageHeader title={title} content={content} breadcrumbs={breadcrumbs} />
    )

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
