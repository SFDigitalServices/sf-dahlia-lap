import React from 'react'
import { shallow, mount } from 'enzyme'
import Context from '~/components/supplemental_application/context'
import { Form } from 'react-final-form'
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom'
import LeaseUpRoutes from '~/routes/LeaseUpRoutes'

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

/**
 * When you shallow render a connected component (a component that is wrapped with useContext()),
 * you have to dive() twice on the wrapper to actually get to the component you're trying to test.
 * @param {} shallowWrapperWithContext
 */
const diveThroughContextWrappers = (shallowWrapperWithContext) =>
  shallowWrapperWithContext.dive().dive()

/**
 * Return a component wrapper for any component that uses react-final-form and useContext()
 *
 * @param application the application object to seed the form with
 * @param formToChildrenFunc a function that takes a form object and returns a node.
 * @param shouldMount true if component should be rendered with enzyme mount.
 *  Only use shouldMount=true if you know you absolutely need mount functionality.
 */
export const shallowWithFormAndContext = (context, formToChildrenFunc) => {
  const formWrapper = shallow(
    <Context.Provider value={context}>
      {formNode(context.application, formToChildrenFunc)}
    </Context.Provider>
  )
    // call dive() here to shallow render the form so we can access the child component
    .dive()

  return diveThroughContextWrappers(diveThroughFormWrappers(formWrapper))
}

export const findByNameAndProps = (wrapper, name, props) => {
  const predicate = (n) =>
    n.name() === name && Object.keys(props).every((k) => n.prop(k) === props[k])

  return wrapper.findWhere(predicate)
}

export const findWithText = (wrapper, nodeName, text) => {
  const predicate = (n) => n.name() === nodeName && n.text() === text
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

export const mountAppWithUrl = (url) => {
  return mount(
    <Router initialEntries={[url]}>
      <LeaseUpRoutes />
    </Router>
  )
}
