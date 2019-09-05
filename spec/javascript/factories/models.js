import values from './values'

const application = (uniqId, attributes = {}) => {
  return {
    'Preference_Order': '1',
    'Application': '1',
    'Application.Name': `Application Name ${uniqId}`,
    'Preference_Lottery_Rank': '1',
    'Application.First_Name': `some first name ${uniqId}`,
    'Application.Last_Name': `some last name ${uniqId}`,
    'Application.Phone': 'some phone',
    'Application.Email': `some email ${uniqId}`,
    'LastModifiedDate:': '14 feb 19',
    'Application.Processing_Status': 'processing',
    'Application.Residence_Address': `1316 BURNETT ${uniqId}`,
    'Listing_Preference_ID.Record_Type_For_App_Preferences': 'CAP',
    ...attributes
  }
}

const applicant = (uniqId) => {
  return {
    Id: uniqId,
    Date_of_Birth: values.fixedISOdDate(),
    'DOB': values.fixedISOdDate(),
    Email: 'xxxx2',
    First_Name: 'xxxx3',
    Last_Name: 'lastName',
    Middle_Name: 'middleName',
    Street: 'address',
    City: 'city',
    State: 'state',
    Zip_Code: 'zip',
    Mailing_Street: 'mailingAddress',
    Mailing_City: 'mailingCity',
    Mailing_State: 'mailingState',
    Mailing_Zip_Code: 'mailingZip',
    Phone: 'phone',
    Phone_Type: 'phoneType'
  }
}

const applicationWithApplicant = (uniqId) => {
  return application(uniqId, { Applicant: applicant(uniqId) })
}

const applicationWithListing = (uniqId) => {
  return application(uniqId, { 'Listing': { 'Id': uniqId } })
}

const listing = (uniqId) => {
  return {
    'Id': uniqId,
    'Name': 'xxx2'
  }
}

const listingFields = () => {
  return {
    'Id': null,
    'Name': {
      'label': 'Listing Name',
      'minWidth': 225
    },
    'Application_Due_Date': {
      'type': 'date'
    },
    'Lottery_Date': {
      'type': 'date'
    },
    'Lottery_Results_Date': {
      'type': 'date'
    },
    'Lottery_Status': null,
    'nFlagged_Applications': {
      'label': 'Flagged Applications'
    },
    'In_Lottery': {
      'label': 'Applications In Lottery'
    }
  }
}

const listingsList = () => {
  return [
    {'Id': 'a0W0x0000005q5MEAQ', 'Name': 'Krissy New Listing 4/5', 'Application_Due_Date': '2018-04-12T17:00:00.000+0000', 'Lottery_Date': null, 'Lottery_Results_Date': null, 'Lottery_Status': 'Not Yet Run', 'nFlagged_Applications': 0, 'In_Lottery': 0},
    {'Id': 'a0W0x000000FeCGEA0', 'Name': 'Krissy Test 411', 'Application_Due_Date': '2018-06-28T17:00:00.000+0000', 'Lottery_Date': null, 'Lottery_Results_Date': null, 'Lottery_Status': 'Not Yet Run', 'nFlagged_Applications': 1, 'In_Lottery': 4}, {'Id': 'a0W0x000000GHiFEAW', 'Name': 'Automated Test Listing Senior All (please do not modify)', 'Application_Due_Date': '2021-01-21T17:00:00.000+0000', 'Lottery_Date': '2021-01-21T17:00:00.000+0000', 'Lottery_Results_Date': '03/23/17', 'Lottery_Status': 'Not Yet Run', 'nFlagged_Applications': 0, 'In_Lottery': 0},
    {'Id': 'a0W0x000000Fg6jEAC', 'Name': 'Krissy 4/13', 'Application_Due_Date': '2018-05-04T17:00:00.000+0000', 'Lottery_Date': null, 'Lottery_Results_Date': null, 'Lottery_Status': 'Not Yet Run', 'nFlagged_Applications': 0, 'In_Lottery': 1},
    {'Id': 'a0W0x000000G5fTEAS', 'Name': 'test 2', 'Application_Due_Date': null, 'Lottery_Date': null, 'Lottery_Results_Date': null, 'Lottery_Status': 'Not Yet Run', 'nFlagged_Applications': 0, 'In_Lottery': 0}, {'Id': 'a0W0x000000G5fOEAS', 'Name': 'test', 'Application_Due_Date': null, 'Lottery_Date': null, 'Lottery_Results_Date': null, 'Lottery_Status': 'Not Yet Run', 'nFlagged_Applications': 0, 'In_Lottery': 0},
    {'Id': 'a0W0P00000DZJSTUA5', 'Name': '2235 Third (Potrero Launch) Unit  W519', 'Application_Due_Date': '2017-02-07T17:00:00.000+0000', 'Lottery_Date': '2017-02-28T17:00:00.000+0000', 'Lottery_Results_Date': '03/02/17', 'Lottery_Status': 'Not Yet Run', 'nFlagged_Applications': 0, 'In_Lottery': 0},
    {'Id': 'a0W0P00000DZJSdUAP', 'Name': '2235 Third (Potrero Launch) Unit E408', 'Application_Due_Date': '2017-02-07T17:00:00.000+0000', 'Lottery_Date': '2017-02-28T17:00:00.000+0000', 'Lottery_Results_Date': '03/02/17', 'Lottery_Status': 'Not Yet Run', 'nFlagged_Applications': 0, 'In_Lottery': 0},
    {'Id': 'a0W0P00000DZKPdUAP', 'Name': '2660 Third (Abaca)', 'Application_Due_Date': '2017-03-10T17:00:00.000+0000', 'Lottery_Date': '2017-03-31T17:00:00.000+0000', 'Lottery_Results_Date': '04/07/17', 'Lottery_Status': 'Lottery Complete', 'nFlagged_Applications': 0, 'In_Lottery': 2907},
    {'Id': 'a0W0P00000F7t4uUAB', 'Name': 'Merry Go Round Shared Housing', 'Application_Due_Date': '2018-02-08T17:00:00.000+0000', 'Lottery_Date': '2018-02-28T17:00:00.000+0000', 'Lottery_Results_Date': '03/01/18', 'Lottery_Status': 'Lottery Complete', 'nFlagged_Applications': 58, 'In_Lottery': 562},
    {'Id': 'a0W0P00000F7wvrUAB', 'Name': 'Pierce Street Apartments', 'Application_Due_Date': '2018-01-31T17:00:00.000+0000', 'Lottery_Date': '2018-02-20T17:00:00.000+0000', 'Lottery_Results_Date': '02/20/18', 'Lottery_Status': 'Lottery Complete', 'nFlagged_Applications': 98, 'In_Lottery': 1306}
  ]
}

const listingDetail = () => {
  return {
    id: 'a0W0P00000F8YG4UAN',
    owner_id: '005U0000005KidlIAC',
    owner: 'Brooke Barber',
    application_due_date: '2020-05-02T00:00:00.000+0000',
    name: 'Automated Test Listing (do not modify)',
    status: 'Active',
    building: 'PR-007828',
    min_br: null,
    lotterry_winners: 0.0,
    max_br: null,
    lottery_results: false,
    min_income: 5255.0,
    account: 'Exygy',
    max_income: null,
    min_occupancy: 1.0,
    max_occupancy: null,
    building_name: 'Automated Test Building',
    neighborhood: 'Hayes Valley',
    building_street_address: null,
    developer: 'TEST Property Manager',
    building_city: 'San Francisco',
    building_url: 'https://sfmohcd.org/sites/default/files/Documents/MOH/Housing%20Listing%20Photos/test-apologies.png',
    building_state: 'CA',
    year_built: 2009.0,
    building_zip_code: null,
    description: null,
    lottery_prefrences: null,
    acessibility: 'Elevator to all floors',
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
    in_lottery: 5383.0,
    leasing_agent_name: 'Larry Agent',
    leasing_agent_title: 'Sales Agent',
    leasing_agent_email: 'larry.livingston@sfgov.org',
    leasing_agent_phone: '(415) 555-5555',
    legal_disclaimers:
      '<span style=\'font-size: 10pt;\'><span style=\'font-family: arial,sans-serif;\'>All BMR renters must review and acknowledge the </span></span><a href=\'http://sf-moh.org/index.aspx?page=295\' target=\'_blank\'><span style=\'font-size: 10pt;\'><span style=\'font-family: arial,sans-serif;\'><span style=\'color: rgb(0, 0, 255);\'>Inclusionary Affordable Housing Program Monitoring and Procedures Manual 2013</span></span></span></a><span style=\'font-size: 10pt;\'><span style=\'font-family: arial,sans-serif;\'> that governs this property upon the signing of a lease for a BMR unit. </span></span><br> <br><span style=\'font-size: 10pt;\'><span style=\'font-family: arial,sans-serif;\'>Applicants should be informed that BMR rental units in some buildings may convert to ownership units in the future.  In the case of conversion, BMR renters will be afforded certain rights as explained in the </span></span><a href=\'http://sf-moh.org/index.aspx?page=295\' target=\'_blank\'><span style=\'font-size: 10pt;\'><span style=\'font-family: arial,sans-serif;\'><span style=\'color: rgb(0, 0, 255);\'>Inclusionary Affordable Housing Program Monitoring and Procedures Manual 2013</span></span></span></a><span style=\'font-size: 10pt;\'><span style=\'font-family: arial,sans-serif;\'>. Applicants should inquire with the building contact person listed above to determine if the building has a minimum number of years that it must remain a rental building.  (Some buildings may have such restrictions based on government sources of financing for their building.) Most buildings may have no restrictions on conversion at all. </span></span><br> <br><span style=\'font-size: 10pt;\'><span style=\'font-family: arial,sans-serif;\'>It is also important to note that units governed by the Inclusionary Housing Program are NOT governed by the San Francisco Rent Ordinance (also known as “rent control”). Among other rules, rents may increase beyond increases allowed under “rent control.”  Please see the </span></span><span style=\'font-size: 12pt;\'><span style=\'font-family: times new roman,serif;\'><a href=\'http://sf-moh.org/index.aspx?page=295\' target=\'_blank\'><span style=\'font-size: 10pt;\'><span style=\'font-family: arial,sans-serif;\'><span style=\'color: rgb(0, 0, 255);\'>Inclusionary Affordable Housing Program Monitoring and Procedures Manual 2013</span></span></span></a></span></span><span style=\'font-size: 10pt;\'><span style=\'font-family: arial,sans-serif;\'> for more information. </span></span>',
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
        attributes: {
          type: 'Open_Houses',
          url: '/services/data/v43.0/sobjects/Open_Houses/a0Y0P00000EyLvJUAV'
        },
        Date: '2018-02-23',
        Start_Time: '9:00AM',
        End_Time: '12:00PM'
      }
    ],
    listing_lottery_preferences: [
      {
        id: 'a0l0P00001Lx8XKQAZ',
        total_submitted_apps: 524.0,
        order: 1.0,
        description:
          'For households in which at least one member holds a Certificate of Preference from the former San Francisco Redevelopment Agency. COP holders were displaced by Agency action generally during the 1960s and 1970s.',
        available_units: 1.0,
        pdf_url: null,
        lottery_preference: {
          id: 'a0m0P00000wwi3IQAQ',
          name: 'Certificate of Preference (COP)'
        }
      },
      {
        id: 'a0l0P00001Lx8XPQAZ',
        total_submitted_apps: 520.0,
        order: 3.0,
        description:
          'For households in which at least one member holds a Displaced Tenant Housing Preference Certificate. DTHP Certificate holders are tenants who were evicted through either an Ellis Act Eviction or an Owner Move In Eviction, or have been displaced by a fire. Once all units reserved for this preference are filled, remaining DTHP holders will receive Live/Work preference, regardless of their current residence or work location.',
        available_units: 3.0,
        pdf_url: null,
        lottery_preference: {
          id: 'a0m0P00000www1mQAA',
          name: 'Displaced Tenant Housing Preference (DTHP)'
        }
      },
      {
        id: 'a0l0P00001Lx8XUQAZ',
        total_submitted_apps: 517.0,
        order: 4.0,
        description:
          'For households in which at least one member either lives within Supervisor district of the project [District #], or within a half-mile of the project.  Requires submission of proof of address.',
        available_units: 4.0,
        pdf_url: null,
        lottery_preference: {
          id: 'a0m0P00000www1rQAA',
          name: 'Neighborhood Resident Housing Preference (NRHP)'
        }
      },
      {
        id: 'a0l0P00001Lx8XZQAZ',
        total_submitted_apps: 1133.0,
        order: 2.0,
        description:
          'For households who are currently paying more than 50% of income for housing costs or are living in public housing or project based Section 8 housing within San Francisco.',
        available_units: 2.0,
        pdf_url: null,
        lottery_preference: {
          id: 'a0m0P00000xTqDtQAK',
          name: 'Rent Burdened / Assisted Housing Preference'
        }
      },
      {
        id: 'a0l0P00001Lx8XeQAJ',
        total_submitted_apps: 1295.0,
        order: 5.0,
        description:
          'For households in which at least one member lives or works in San Francisco.  Requires submission of proof.  Please note in order to claim Work Preference, the applicant currently work in San Francisco at least 75% of their working hours.',
        available_units: 5.0,
        pdf_url: null,
        lottery_preference: {
          id: 'a0m0P00000wwi3NQAQ',
          name: 'Live or Work in San Francisco Preference'
        }
      },
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
    ],
    units: [
      {
        unit_type: '1 BR',
        bmr_rent_monthly: 2102.0,
        bmr_rental_minimum_monthly_income_needed: 5255.0,
        status: 'Available',
        property_type: null,
        ami_chart_type: 'HUD Unadjusted',
        ami_chart_year: 2016.0,
        of_ami_for_pricing_unit: 100.0,
        reserved_type: null
      }
    ],
    is_sale: false,
    is_rental: true
  }
}

const applicationFields = () => {
  return {
    Id: null,
    'Listing.Name': {
      label: 'Listing Name'
    },
    Rule_Name: null,
    Total_Number_of_Duplicates: null
  }
}

const applicationsList = () => {
  return [
    { Id: 'a0r0x000002BhjHAAS', 'Listing.Name': 'TEST Listing', Rule_Name: 'Residence Address', Total_Number_of_Duplicates: 1 },
    { Id: 'a0r0x000002BhjHAAS', 'Listing.Name': 'TEST Listing', Rule_Name: 'Residence Address', Total_Number_of_Duplicates: 1 }
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
