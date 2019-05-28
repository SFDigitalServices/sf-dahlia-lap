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
    'attributes': {
      'type': 'Listing',
      'url': '/services/data/v26.0/sobjects/Listing/a0W0x000000GhJUEA0'
    },
    'Id': 'a0W0x000000GhJUEA0',
    'OwnerId': '0050P000007H5XsQAK',
    'Owner': {
      'attributes': {
        'type': 'Name',
        'url': '/services/data/v26.0/sobjects/User/0050P000007H5XsQAK'
      },
      'Name': 'Prod Vertiba'
    },
    'Application_Due_Date': '2018-05-31T20:59:00.000+0000',
    'Name': 'Test 5/30',
    'Status': 'Active',
    'Building': {
      'attributes': {
        'type': 'Building',
        'url': '/services/data/v26.0/sobjects/Building/a0aU00000098I4WIAU'
      },
      'Name': 'PR-000001'
    },
    'Min_BR': null,
    'Lottery_Winners': 0,
    'Max_BR': null,
    'Lottery_Results': false,
    'Min_Income': 0,
    'Account': {
      'attributes': {
        'type': 'Account',
        'url': '/services/data/v26.0/sobjects/Account/0010P00001pIXNcQAO'
      },
      'Name': 'Equity Residential'
    },
    'Max_Income': null,
    'Min_Occupancy': 1,
    'Max_Occupancy': null,
    'Building_Name': '77 Bluxome',
    'Neighborhood': 'South of Market',
    'Building_Street_Address': '77 Bluxome Street',
    'Developer': 'Equity Residential',
    'Building_City': 'San Francisco',
    'Building_URL': 'https://i.imgur.com/Jh8OHJY.jpg',
    'Building_State': 'CA',
    'Year_Built': 2008,
    'Building_Zip_Code': '94107',
    'Description': null,
    'Lottery_Preferences': null,
    'Accessibility': null,
    'Fee': null,
    'Amenities': null,
    'Deposit_Min': null,
    'Costs_Not_Included': null,
    'Deposit_Max': null,
    'Lottery_Date': null,
    'Lottery_Results_Date': null,
    'Lottery_Venue': null,
    'Lottery_Summary': null,
    'Lottery_Street_Address': null,
    'Lottery_City': 'San Francisco',
    'Lottery_URL': null,
    'Reserved_community_type': null,
    'Application_Phone': null,
    'Application_Organization': null,
    'Application_Street_Address': null,
    'Application_City': null,
    'Download_URL': null,
    'Application_State': 'CA',
    'Application_Postal_Code': null,
    'In_Lottery': 2,
    'Leasing_Agent_Name': 'Cullen McCaffrey',
    'Leasing_Agent_Title': null,
    'Leasing_Agent_Email': '77bluxome@eqr.com',
    'Leasing_Agent_Phone': '(415) 957-5887',
    'Legal_Disclaimers': 'some disclaimer',
    'Building_Selection_Criteria': null,
    'Pet_Policy': null,
    'Required_Documents': null,
    'Smoking_Policy': null,
    'Eviction_History': null,
    'Criminal_History': null,
    'Credit_Rating': null,
    'Lottery_Status': 'Not Yet Run',
    'Office_Hours': null,
    'Information_Sessions': null,
    'Open_Houses': null,
    'Listing_Lottery_Preferences': [
      {
        'attributes': {
          'type': 'Listing_Lottery_Preference',
          'url': '/services/data/v26.0/sobjects/Listing_Lottery_Preference/a0l0x000000RI8nAAG'
        },
        'Id': 'a0l0x000000RI8nAAG',
        'Total_Submitted_Apps': 0,
        'Order': null,
        'Description': 'For households in which at least one member was a resident of the Alice Griffith housing development. This includes baseline and current residents that lived in the targeted redevelopment site on or after the time of application for Choice Neighborhoods of October 26, 2010.',
        'Available_Units': null,
        'PDF_URL': null,
        'Lottery_Preference': {
          'attributes': {
            'type': 'Lottery_Preference',
            'url': '/services/data/v26.0/sobjects/Lottery_Preference/a0m0P00000yuzO0QAI'
          },
          'Id': 'a0m0P00000yuzO0QAI',
          'Name': 'Alice Griffith Housing Development Resident'
        }
      }
    ],
    'Units': [
      {
        'attributes': {
          'type': 'Unit',
          'url': '/services/data/v26.0/sobjects/Unit/a0b0x000000yyMBAAY'
        },
        'Unit_Type': 'Studio',
        'BMR_Rent_Monthly': null,
        'BMR_Rental_Minimum_Monthly_Income_Needed': 0,
        'Status': 'Available',
        'Property_Type': null,
        'AMI_chart_type': 'HUD Unadjusted',
        'AMI_chart_year': 2017,
        'of_AMI_for_Pricing_Unit': null,
        'Reserved_Type': null
      }
    ]
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
