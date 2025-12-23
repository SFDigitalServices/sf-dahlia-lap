import React from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { Form } from 'react-final-form'
import { MemoryRouter as Router } from 'react-router-dom'

import Provider from 'context/Provider'
import LeaseUpRoutes from 'routes/LeaseUpRoutes'

/**
 * Create a test QueryClient with settings optimized for testing
 */
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0
      },
      mutations: {
        retry: false
      }
    }
  })

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

export const leaseUpAppWithUrl = (url, queryClient = createTestQueryClient()) => (
  <QueryClientProvider client={queryClient}>
    <Provider>
      <Router initialEntries={[url]}>
        <LeaseUpRoutes />
      </Router>
    </Provider>
  </QueryClientProvider>
)

export const renderAppWithUrl = (url) => render(leaseUpAppWithUrl(url))
