import React from 'react'

import { render } from '@testing-library/react'
import { Form } from 'react-final-form'
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom'

import Provider from 'context/Provider'
import LeaseUpRoutes from 'routes/LeaseUpRoutes'

const formNode = (application, formToChildrenFunc) => (
  <Form
    onSubmit={() => null}
    initialValues={application}
    render={({ form }) => <form noValidate>{formToChildrenFunc(form)}</form>}
  />
)

/**
 * Return a component wrapper for any component that uses react-final-form
 *
 * @param application the application object to seed the form with
 * @param formToChildrenFunc a function that takes a form object and returns a node.
 * @param shouldMount true if component should be rendered with enzyme mount.
 *  Only use shouldMount=true if you know you absolutely need mount functionality,
 *  like if you're trying to test final form error functionality or want to end-to-end
 *  test the whole component tree.
 */
export const withForm = (application, formToChildrenFunc) =>
  render(formNode(application, formToChildrenFunc))

export const nameOrTypeMatches = (node, nodeNameOrType) =>
  typeof nodeNameOrType === 'string'
    ? node.name() === nodeNameOrType
    : node.type() === nodeNameOrType

/**
 * Find the child or children that have the given name and props.
 *
 * @param {*} wrapper the enzyme wrapper to search through (can be shallow or mounted)
 * @param {*} nodeNameOrType either a string node name or a component constructor function. Ex. any
 *                           of the following will work: ['RentalAssistance', RentalAssistance,
 *                           'a', 'button']. Note that complicated selectors do not work, eg. 'button#button_id'
 * @param {*} props The props to check equality for. These do not have to be exhaustive, we only check the props
 *                  that are provided.
 */
export const findWithProps = (wrapper, nodeNameOrType, props) => {
  const predicate = (n) =>
    nameOrTypeMatches(n, nodeNameOrType) && Object.keys(props).every((k) => n.prop(k) === props[k])

  return wrapper.findWhere(predicate)
}

/**
 * Find the child or children that have the given name and text representation.
 *
 * @param {*} wrapper the enzyme wrapper to search through (can be shallow or mounted)
 * @param {*} nodeNameOrType either a string node name or a component constructor function. Ex. any
 *                           of the following will work: ['RentalAssistance', RentalAssistance,
 *                           'a', 'button']. Note that complicated selectors do not work, eg. 'button#button_id'
 * @param {*} text The exact text the child has.
 */
export const findWithText = (wrapper, nodeNameOrType, text) => {
  const predicate = (n) => nameOrTypeMatches(n, nodeNameOrType) && n.text() === text
  return wrapper.findWhere(predicate)
}

export const withRouter = (urlWithParamPlaceholders, url, children) => {
  return (
    <Router initialEntries={[url]}>
      <Routes>
        <Route path={urlWithParamPlaceholders} element={children} />
      </Routes>
    </Router>
  )
}

export const leaseUpAppWithUrl = (url) => (
  <Provider>
    <Router initialEntries={[url]}>
      <LeaseUpRoutes />
    </Router>
  </Provider>
)

export const renderAppWithUrl = (url) => render(leaseUpAppWithUrl(url))
