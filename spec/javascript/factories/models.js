const application = (uniqId, attributes = {}) => {
  return {
    preference_order: '1',
    application: '1',
    'application.name': `application Name ${uniqId}`,
    preference_lottery_rank: '1',
    'application.first_name': `some first name ${uniqId}`,
    'application.last_name': `some last name ${uniqId}`,
    'application.phone': 'some phone',
    'application.email': `some email ${uniqId}`,
    last_modified_date: '14 feb 19',
    'application.processing_status': 'processing',
    'application.residence_address': `1316 BURNETT ${uniqId}`,
    record_type_for_app_preferences: 'CAP',
    ...attributes
  }
}

const applicant = (uniqId) => {
  return {
    id: uniqId,
    date_of_birth: {
      year: '1990',
      month: '01',
      day: '20'
    },
    email: 'xxxx2',
    first_name: 'xxxx3',
    last_name: 'lastName',
    middle_name: 'middleName',
    street: 'address',
    city: 'city',
    state: 'state',
    zip: 'zip',
    mailing_street: 'mailingAddress',
    mailing_city: 'mailingCity',
    mailing_state: 'mailingState',
    mailing_zip_code: 'mailingZip',
    phone: 'phone',
    phone_type: 'phoneType'
  }
}

const applicationWithApplicant = (uniqId) => {
  return application(uniqId, { Applicant: applicant(uniqId) })
}

const applicationWithListing = (uniqId) => {
  return application(uniqId, { listing: { id: uniqId } })
}

const listing = (uniqId) => {
  return {
    id: uniqId,
    name: 'xxx2'
  }
}

const listingFields = () => {
  return {
    id: null,
    name: {
      label: 'Listing Name',
      minWidth: 225
    },
    application_due_date: {
      type: 'date'
    },
    lottery_date: {
      type: 'date'
    },
    lottery_results_date: {
      type: 'date'
    },
    lottery_status: null,
    nflagged_applications: {
      label: 'Flagged applications'
    },
    in_lottery: {
      label: 'applications In Lottery'
    }
  }
}

const listingsList = () => {
  return [
    { id: 'a0W0x000000Fg6jEAC', name: 'Krissy 4/13', application_due_date: '2018-05-04T17:00:00.000+0000', lottery_date: null, lottery_results_date: null, lottery_status: 'Not Yet Run', nflagged_applications: 0, in_lottery: 1 },
    { id: 'a0W0x000000G5fTEAS', name: 'test 2', application_due_date: null, lottery_date: null, lottery_results_date: null, lottery_status: 'Not Yet Run', nflagged_applications: 0, in_lottery: 0 }, { Id: 'a0W0x000000G5fOEAS', name: 'test', application_due_date: null, lottery_date: null, lottery_results_date: null, lottery_status: 'Not Yet Run', nflagged_applications: 0, in_lottery: 0 },
    { id: 'a0W0P00000DZJSTUA5', name: '2235 Third (Potrero Launch) Unit  W519', application_due_date: '2017-02-07T17:00:00.000+0000', lottery_date: '2017-02-28T17:00:00.000+0000', lottery_results_date: '03/02/17', lottery_status: 'Not Yet Run', nflagged_applications: 0, in_lottery: 0 },
    { id: 'a0W0P00000DZJSdUAP', name: '2235 Third (Potrero Launch) Unit E408', application_due_date: '2017-02-07T17:00:00.000+0000', lottery_date: '2017-02-28T17:00:00.000+0000', lottery_results_date: '03/02/17', lottery_status: 'Not Yet Run', nflagged_applications: 0, in_lottery: 0 },
    { id: 'a0W0P00000DZKPdUAP', name: '2660 Third (Abaca)', application_due_date: '2017-03-10T17:00:00.000+0000', lottery_date: '2017-03-31T17:00:00.000+0000', lottery_results_date: '04/07/17', lottery_status: 'Lottery Complete', nflagged_applications: 0, in_lottery: 2907 },
    { id: 'a0W0P00000F7t4uUAB', name: 'Merry Go Round Shared Housing', application_due_date: '2018-02-08T17:00:00.000+0000', lottery_date: '2018-02-28T17:00:00.000+0000', lottery_results_date: '03/01/18', lottery_status: 'Lottery Complete', nflagged_applications: 58, in_lottery: 562 },
    { id: 'a0W0P00000F7wvrUAB', name: 'Pierce Street Apartments', application_due_date: '2018-01-31T17:00:00.000+0000', lottery_date: '2018-02-20T17:00:00.000+0000', lottery_results_date: '02/20/18', lottery_status: 'Lottery Complete', nflagged_applications: 98, in_lottery: 1306 }
  ]
}

const listingDetail = () => {
  return {
    id: 'a0W0x000000GhJUEA0',
    owner_id: '0050P000007H5XsQAK',
    owner: 'Prod Vertiba',
    application_due_date: '2018-05-31T20:59:00.000+0000',
    name: 'Test 5/30',
    status: 'Active',
    building: 'PR-000001',
    min_br: null,
    lottery_winners: 0.0,
    max_br: null,
    lottery_results: false,
    min_income: 0.0,
    account: 'Exygy',
    max_income: null,
    min_occupancy: 1.0,
    max_occupancy: null,
    building_name: '77 Bluxome',
    neighborhood: 'South of Market',
    building_street_address: '77 Bluxome Street',
    developer: 'Equity Residential',
    building_city: 'San Francisco',
    building_url: 'https://i.imgur.com/Jh8OHJY.jpg',
    building_state: 'CA',
    year_built: 2008.0,
    building_zip_code: '94107',
    description: null,
    lottery_preferences: null,
    accessibility: null,
    fee: null,
    amenities: 'Laundry room, underground parking, courtyard, bike room',
    deposit_min: 2102.0,
    costs_not_included:
      'Tenants pay for gas, electricity.\r\n\r\nFor pet fees:  Cat is allowed with a $500 refundable deposit, $250 non-refundable cleaning fee and a pet addendum.  \r\n\r\nDogs are not allowed in the building.  \r\n\r\nOne parking space per unit available for $175 a month.',
    deposit_max: 2355.0,
    lottery_date: '2017-03-22T18:00:00.000+0000',
    lottery_results_date: '2017-03-23',
    lottery_venue: 'MOHCD',
    lottery_summary: null,
    lottery_street_address: '1 S. Van Ness Avenue 5th FL',
    lottery_city: 'San Francisco',
    lottery_url: null,
    reserved_community_type: null,
    application_phone: '(415) 227-2256',
    application_organization: '280 Fell-BMR',
    application_street_address: 'P.O. Box 420847',
    application_city: 'San Francisco',
    download_url: null,
    application_state: 'CA',
    application_postal_code: '94142',
    in_lottery: 2.0,
    leasing_agent_name: 'Cullen McCaffrey',
    leasing_agent_title: 'Sales Agent',
    leasing_agent_email: '77bluxome@eqr.com',
    leasing_agent_phone: '(415) 957-5887',
    legal_disclaimers: 'some disclaimer',
    building_selection_criteria: 'https://us.awp.autotask.net/1/filelink/113bd-37ed41a1-53a7f01459-2',
    pet_policy: 'Dogs are not allowed in the building.',
    report_id: null,
    required_documents:
      'Lottery winners will be required to fill out a building application and provide a copy of your current credit report, 3 most recent paystubs, current tax returns and W-2, and 3 most recent bank statements.',
    smoking_policy: 'Non-smoking building',
    eviction_history:
      'Provide minimum of 4 years rental history with at least two prior rentals in which you were responsible for paying the rent.  Applicants without rental history will still be considered. No Guarantors permitted. \r\n\r\nPrevious rental history will be reviewed and must exhibit no derogatory references. \r\n\r\nLandlord references will only check for evictions, payment history, and documented lease violations. No-fault evictions (Ellis Act, Owner Move-in evictions) will not be held against a household. \r\n\r\nAll debt owed to an apartment community must be satisfied. \r\n\r\nMitigating circumstances may be considered.',
    criminal_history: null,
    credit_rating:
      'Provide a credit report with score from Equifax, Experian, or TransUnion dated within thirty (30) days of the application. \r\n\r\nAccounts that are not current or that are derogatory will negatively affect the overall scoring, which could result in the denial of the application or an additional deposit may be required. \r\n\r\nCollection accounts exceeding a combined amount of $1,000.00 (excluding student loans and medical debt) will negatively affect the overall scoring, which could result in the denial of the application or an additional deposit may be required. \r\n\r\nBankruptcy if not cleared will be an automatic denial of the rental application. \r\n\r\nNo Guarantors permitted.\r\n\r\nMitigating circumstances may be considered.',
    lottery_status: 'Not Yet Run',
    office_hours: null,
    tenure: 'Re-rental',
    information_sessions: null,
    open_houses: [
      {
        date: '2018-02-23',
        start_time: '9:00AM',
        end_time: '12:00PM'
      }
    ],
    listing_lottery_preferences: [
      {
        id: 'a0l0x000000RI8nAAG',
        total_submitted_apps: 0.0,
        order: null,
        description:
          'For households in which at least one member was a resident of the Alice Griffith housing development. This includes baseline and current residents that lived in the targeted redevelopment site on or after the time of application for Choice Neighborhoods of October 26, 2010.',
        available_units: 1.0,
        pdf_url: null,
        lottery_preference: {
          id: 'a0m0P00000yuzO0QAI',
          name: 'Alice Griffith Housing Development Resident'
        }
      }
    ],
    units: [
      {
        unit_type: 'Studio',
        bmr_rent_monthly: null,
        bmr_rental_minimum_monthly_income_needed: 0.0,
        status: 'Available',
        property_type: null,
        ami_chart_type: 'HUD Unadjusted',
        ami_chart_year: 2017.0,
        reserved_type: null
      }
    ],
    is_sale: false,
    is_rental: true
  }
}

const applicationFields = () => {
  return {
    id: null,
    'listing.name': {
      label: 'Listing Name'
    },
    rule_name: null,
    total_number_of_duplicates: null
  }
}

const applicationsList = () => {
  return [
    { id: 'a0r0x000002BhjHAAS', 'listing.name': 'TEST Listing', rule_name: 'Residence Address', total_number_of_duplicates: 1 },
    { Id: 'a0r0x000002BhjHAAS', 'listing.name': 'TEST Listing', rule_name: 'Residence Address', total_number_of_duplicates: 1 }
  ]
}

export default {
  listing,
  listingFields,
  listingsList,
  listingDetail,
  application,
  applicationWithListing,
  applicationsList,
  applicant,
  applicationWithApplicant,
  applicationFields
}
