import React from 'react'

import { shallow, mount } from 'enzyme'
import { Form } from 'react-final-form'
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom'

import Provider from 'context/Provider'
import LeaseUpRoutes from 'routes/LeaseUpRoutes'

const formNode = (application, formToChildrenFunc) => (
  <Form
    onSubmit={() => null}
    initialValues={application}
    render={({ form }) => <form noValidate>{formToChildrenFunc(form)}</form>}
  />
)

const diveThroughFormWrappers = (wrapper) => wrapper.find('form').children().dive()

const shallowWithForm = (application, formToChildrenFunc) =>
  diveThroughFormWrappers(shallow(formNode(application, formToChildrenFunc)))

const mountWithForm = (application, formToChildrenFunc) =>
  mount(formNode(application, formToChildrenFunc))

/** similar to withForm but doesn't actually render the node */
export const withFormNode = (application, formToChildrenFunc) =>
  formNode(application, formToChildrenFunc)

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
export const withForm = (application, formToChildrenFunc, shouldMount = false) =>
  shouldMount
    ? mountWithForm(application, formToChildrenFunc)
    : shallowWithForm(application, formToChildrenFunc)

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
      <Switch>
        <Route path={urlWithParamPlaceholders}>{children}</Route>
      </Switch>
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

export const mountAppWithUrl = (url) => mount(leaseUpAppWithUrl(url))
