import React from 'react'

import { waitFor, fireEvent, render, screen } from '@testing-library/react'
import { clone } from 'lodash'
import { act } from 'react-dom/test-utils'

import PaperApplicationForm from 'components/applications/application_form/PaperApplicationForm'

import application from '../../../fixtures/application'
import lendingInstitutions from '../../../fixtures/lending_institutions'
import listing from '../../../fixtures/listing'

const DECLINE = 'Decline to state'
const mockSubmitApplication = jest.fn()

let testApplication

jest.mock('apiService', () => {
  return {
    submitApplication: async (application) => {
      mockSubmitApplication(application)
      return { application }
    }
  }
})

describe('PaperApplicationForm', () => {
  beforeEach(() => {
    testApplication = clone(application)
  })

  describe('should validate fields correctly:', () => {
    test('language', async () => {
      testApplication.application_language = null
      testApplication.demographics = {}
      render(
        <PaperApplicationForm
          listing={listing}
          application={testApplication}
          lendingInstitutions={{}}
          onSubmit={() => null}
        />
      )

      expect(screen.queryByText('Please select a language.')).not.toBeInTheDocument()

      // Save without specifying language
      await act(async () => fireEvent.click(screen.getAllByRole('button', { name: /save/i })[0]))

      await waitFor(() => expect(screen.getByText('Please select a language.')).toBeInTheDocument())

      fireEvent.change(
        screen.getByRole('combobox', { name: /language submitted in \(required\)/i }),
        {
          target: { value: 'English' }
        }
      )

      await act(async () => fireEvent.click(screen.getAllByRole('button', { name: /save/i })[0]))

      await waitFor(() =>
        expect(screen.queryByText('Please select a language.')).not.toBeInTheDocument()
      )
    })

    test('alternate Contact', async () => {
      testApplication.alternate_contact = {
        first_name: 'Federic',
        middle_name: 'Daaaa',
        last_name: 'dayan',
        email: 'fede@eee.com'
      }
      render(
        <PaperApplicationForm
          listing={listing}
          application={testApplication}
          lendingInstitutions={{}}
          onSubmit={() => null}
        />
      )

      expect(screen.queryByText(/Please enter a First Name\./i)).not.toBeInTheDocument()

      await act(async () => fireEvent.click(screen.getAllByRole('button', { name: /save/i })[0]))

      // // Delete alt contact first name and expect validation
      fireEvent.change(screen.getByDisplayValue(/federic/i), {
        target: { value: '' }
      })

      await act(async () => fireEvent.click(screen.getAllByRole('button', { name: /save/i })[0]))

      expect(screen.getByText(/Please enter a First Name/i)).toBeInTheDocument()

      fireEvent.change(screen.getByDisplayValue(/daaaa/i), {
        target: { value: '' }
      })
      fireEvent.change(screen.getByDisplayValue(/dayan/i), {
        target: { value: '' }
      })
      fireEvent.change(screen.getByDisplayValue(/fede@eee\.com/i), {
        target: { value: '' }
      })

      await act(async () => fireEvent.click(screen.getAllByRole('button', { name: /save/i })[0]))

      expect(screen.queryByText(/Please enter a First Name/i)).not.toBeInTheDocument()
    })

    test('annual Income', async () => {
      testApplication.annual_income = 'foo'
      render(
        <PaperApplicationForm
          listing={listing}
          application={testApplication}
          lendingInstitutions={{}}
        />
      )

      expect(screen.queryByText(/please enter a valid dollar amount\./i)).not.toBeInTheDocument()

      await act(async () => fireEvent.click(screen.getAllByRole('button', { name: /save/i })[0]))

      expect(screen.getByText(/please enter a valid dollar amount\./i)).toBeInTheDocument()
    })

    test('demographics Defaults', async () => {
      testApplication.demographics = {}
      render(
        <PaperApplicationForm
          listing={listing}
          application={testApplication}
          lendingInstitutions={{}}
          onSubmit={() => null}
        />
      )
      await act(async () => fireEvent.click(screen.getAllByRole('button', { name: /save/i })[0]))

      expect(screen.getByText(/Ethnicity is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Race is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Gender is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Sexual Orientation is required/i)).toBeInTheDocument()

      fireEvent.change(
        screen.getByRole('combobox', {
          name: /ethnicity \(required\)/i
        }),
        {
          target: { value: DECLINE }
        }
      )

      fireEvent.change(
        screen.getByRole('combobox', {
          name: /race \(required\)/i
        }),
        {
          target: { value: DECLINE }
        }
      )

      fireEvent.change(
        screen.getByRole('combobox', {
          name: /gender \(required\)/i
        }),
        {
          target: { value: DECLINE }
        }
      )

      fireEvent.change(
        screen.getByRole('combobox', {
          name: /sexual orientation \(required\)/i
        }),
        {
          target: { value: DECLINE }
        }
      )

      await act(async () => fireEvent.click(screen.getAllByRole('button', { name: /save/i })[0]))

      expect(screen.queryByText(/Ethnicity is required/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/Race is required/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/Gender is required/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/Sexual Orientation is required/i)).not.toBeInTheDocument()
    })

    test('demographics Not Listed', async () => {
      testApplication.demographics = {}
      render(
        <PaperApplicationForm
          listing={listing}
          application={testApplication}
          lendingInstitutions={{}}
          onSubmit={() => null}
        />
      )
      // Select "Not Listed" for gender and sexual orientation
      fireEvent.change(
        screen.getByRole('combobox', {
          name: /gender \(required\)/i
        }),
        {
          target: { value: 'Not Listed' }
        }
      )

      fireEvent.change(
        screen.getByRole('combobox', {
          name: /sexual orientation \(required\)/i
        }),
        {
          target: { value: 'Not Listed' }
        }
      )

      await act(async () => fireEvent.click(screen.getAllByRole('button', { name: /save/i })[0]))

      // Check that these validation messages are shown since Not Listed was chosen
      // The user needs to input something into the test box below
      await waitFor(() => expect(screen.getByText(/Gender is required/i)).toBeInTheDocument())
      await waitFor(() =>
        expect(screen.getByText(/Sexual Orientation is required/i)).toBeInTheDocument()
      )

      // Fill out the gender/sexual orientation other fields
      fireEvent.change(
        screen.getByRole('textbox', {
          name: /gender specify \(if not listed\)/i
        }),
        {
          target: { value: 'Not Listed' }
        }
      )
      fireEvent.change(
        screen.getByRole('textbox', {
          name: /sexual orientation \(if not listed\)/i
        }),
        {
          target: { value: 'Not Listed' }
        }
      )
      await act(async () => fireEvent.click(screen.getAllByRole('button', { name: /save/i })[0]))
      // await waitFor(() => expect(screen.queryByText(/Gender is required/i)).not.toBeInTheDocument())
      // await waitFor(() =>
      //   expect(screen.queryByText(/Sexual Orientation is required/i)).not.toBeInTheDocument()
      // )
      expect(screen.queryByText(/Gender is required/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/Sexual Orientation is required/i)).not.toBeInTheDocument()

      // // Change selected gender/orientation to something other than not listed
      fireEvent.change(
        screen.getByRole('combobox', {
          name: /gender \(required\)/i
        }),
        {
          target: { value: DECLINE }
        }
      )

      fireEvent.change(
        screen.getByRole('combobox', {
          name: /sexual orientation \(required\)/i
        }),
        {
          target: { value: DECLINE }
        }
      )

      await act(async () => fireEvent.click(screen.getAllByRole('button', { name: /save/i })[0]))
      expect(screen.queryByText(/Gender is required/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/Sexual Orientation is required/i)).not.toBeInTheDocument()
    })

    test('signature on Terms of Agreement', async () => {
      testApplication.terms_acknowledged = false
      render(
        <PaperApplicationForm
          listing={listing}
          application={testApplication}
          lendingInstitutions={{}}
          onSubmit={() => null}
        />
      )
      await act(async () => fireEvent.click(screen.getAllByRole('button', { name: /save/i })[0]))

      expect(screen.getByText('Signature on Terms of Agreement is required')).toBeInTheDocument()

      fireEvent.click(
        screen.getByRole('checkbox', {
          name: /signature on terms of agreement \(required\)/i
        })
      )

      await act(async () => fireEvent.click(screen.getAllByRole('button', { name: /save/i })[0]))

      expect(
        screen.queryByText('Signature on Terms of Agreement is required')
      ).not.toBeInTheDocument()
    })
  })

  describe('should render EligibilitySection correctly', () => {
    describe('rental listing', () => {
      test('section should be empty', async () => {
        render(
          <PaperApplicationForm
            listing={listing}
            application={testApplication}
            lendingInstitutions={{}}
          />
        )
        expect(screen.queryByText('Eligibility Information')).not.toBeInTheDocument()
      })
    })

    describe('sale listing', () => {
      beforeEach(() => {
        listing.is_sale = true
        listing.is_rental = false
      })

      test('should show Eligibility Section', async () => {
        render(
          <PaperApplicationForm
            listing={listing}
            application={testApplication}
            lendingInstitutions={{}}
          />
        )
        expect(screen.getByText('Eligibility Information')).toBeInTheDocument()
      })

      test('should allow lending institution and lending agent to be filled out', async () => {
        render(
          <PaperApplicationForm
            listing={listing}
            lendingInstitutions={lendingInstitutions}
            application={testApplication}
          />
        )

        fireEvent.change(
          screen.getByRole('combobox', {
            name: /name of lending institution \(required\)/i
          }),
          {
            target: { value: 'First Republic Bank' }
          }
        )

        expect(screen.getByText('Hilary Byrde')).toBeInTheDocument()
        await act(async () => fireEvent.click(screen.getAllByRole('button', { name: /save/i })[0]))

        expect(
          screen.getAllByText('The applicant cannot qualify for the listing unless this is true.')
        ).toHaveLength(3)
        expect(screen.getByText('Please select a lender.')).toBeInTheDocument()

        fireEvent.change(
          screen.getByRole('combobox', {
            name: /name of lender \(required\)/i
          }),
          {
            target: { value: '003U000001Wnp5gIAB' }
          }
        )

        await act(async () => fireEvent.click(screen.getAllByRole('button', { name: /save/i })[0]))

        expect(screen.queryByText('Please select a lender.')).not.toBeInTheDocument()
      })

      describe('lending institution and lender dropdowns should be filled out', () => {
        test('lender select should be filled out', async () => {
          testApplication.lending_agent = '003U000001Wnp5gIAB'
          render(
            <PaperApplicationForm
              listing={listing}
              lendingInstitutions={lendingInstitutions}
              application={testApplication}
            />
          )
          // add additional tick to allow lending institutions to load
          expect(
            screen.getByRole('combobox', {
              name: /name of lending institution \(required\)/i
            })
          ).toHaveValue('First Republic Bank')

          expect(
            screen.getByRole('combobox', {
              name: /name of lender \(required\)/i
            })
          ).toHaveValue('003U000001Wnp5gIAB')
        })
      })
    })
  })
  describe('preferences section', () => {
    // Helper function for updating preference select successfully
    const updatePreference = async (prefId) => {
      fireEvent.change(screen.getByTestId('preferences[0].listing_preference_id'), {
        target: { value: prefId }
      })
    }

    test('add preference button is disabled without primary applicant', async () => {
      // console.log({ ...testApplication, preferences: undefined })
      render(
        <PaperApplicationForm
          listing={{
            ...listing,
            listing_lottery_preferences: [
              {
                id: 'a0l0P00001PsqDoQAJ',
                total_submitted_apps: 509.0,
                order: null,
                description:
                  'For households in which at least one member was a resident of the Alice Griffith housing development. This includes baseline and current residents that lived in the targeted redevelopment site on or after the time of application for Choice Neighborhoods of October 26, 2010.',
                available_units: null,
                pdf_url: null,
                lottery_preference: {
                  id: 'a0m0P00000yuzO0QAI',
                  name: 'Alice Griffith Housing Development Resident'
                }
              }
            ]
          }}
          lendingInstitutions={lendingInstitutions}
          application={{
            ...testApplication,
            preferences: [
              {
                name: 'AP-0000612141',
                preference_name: 'Alice Griffith Housing Development Resident',
                person_who_claimed_name: null,
                type_of_proof: null,
                opt_out: null,
                listing_preference_id: 'a0l0x000000RI8nAAG',
                receives_preference: true,
                individual_preference: null,
                certificate_number: null,
                preference_order: 0,
                lottery_status: 'None',
                city: null,
                state: null,
                zip_code: null,
                street: null,
                application_member: {
                  first_name: 'karen',
                  last_name: 'jones',
                  date_of_birth: {
                    year: '1950',
                    month: '01',
                    day: '01'
                  }
                },
                recordtype_developername: 'AG',
                application_member_id: 'a0n0x000000AbE6AAK'
              }
            ]
          }}
        />
      )

      await waitFor(() =>
        expect(
          screen.getByRole('button', {
            name: /\+ add preference/i
          })
        ).toBeDisabled()
      )
    })

    test('should clear values on preference select change to null', async () => {
      testApplication.preferences = [{}]
      render(
        <PaperApplicationForm
          listing={listing}
          lendingInstitutions={{}}
          onSubmit={() => null}
          application={testApplication}
        />
      )
      // Select a preference to start with
      const copPreferenceId = 'a0l0P00001Lx8XKQAZ'
      const hhNaturalKey = 'karen,jones,1950-01-01'

      fireEvent.click(
        screen.getByRole('button', {
          name: /\+ add preference/i
        })
      )
      updatePreference(copPreferenceId)

      // Fill out a field in the preference
      fireEvent.change(
        screen.getByRole('combobox', {
          name: /name of cop holder \(required\)/i
        }),
        { target: { value: hhNaturalKey } }
      )

      expect(
        screen.getByRole('combobox', {
          name: /name of cop holder \(required\)/i
        })
      ).toHaveValue(hhNaturalKey)
      expect(screen.getByTestId('preferences[0].listing_preference_id')).toHaveValue(
        copPreferenceId
      )

      updatePreference('')

      expect(
        screen.queryByRole('combobox', {
          name: /name of cop holder \(required\)/i
        })
      ).not.toBeInTheDocument()
    })

    test('should clear values on preference select change to other preference', async () => {
      testApplication.preferences = [{}]
      render(
        <PaperApplicationForm
          listing={listing}
          lendingInstitutions={{}}
          onSubmit={() => null}
          application={testApplication}
        />
      )
      // Select a preference to start with
      const copPreferenceId = 'a0l0P00001Lx8XKQAZ'
      const liveWorkPreferenceId = 'a0l0P00001Lx8XeQAJ'
      const hhNaturalKey = 'karen,jones,1950-01-01'

      fireEvent.click(
        screen.getByRole('button', {
          name: /\+ add preference/i
        })
      )
      updatePreference(copPreferenceId)

      // Fill out a field in the preference
      fireEvent.change(
        screen.getByRole('combobox', {
          name: /name of cop holder \(required\)/i
        }),
        { target: { value: hhNaturalKey } }
      )

      // Verify that it's in the state
      expect(
        screen.getByRole('combobox', {
          name: /name of cop holder \(required\)/i
        })
      ).toHaveValue(hhNaturalKey)
      expect(screen.getByTestId('preferences[0].listing_preference_id')).toHaveValue(
        copPreferenceId
      )

      // Change to different preference
      await updatePreference(liveWorkPreferenceId)

      // Verify the state is cleared except for listing preference id
      expect(screen.getByTestId('preferences[0].listing_preference_id')).toHaveValue(
        liveWorkPreferenceId
      )
    })
  })
})
