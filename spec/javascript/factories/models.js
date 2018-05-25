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
    Phone_Type: 'phoneType',
  }
}

const applicationWithApplicant = (uniqId) => {
  return application(uniqId, { Applicant: applicant(uniqId) } )
}

const applicationWithListing = (uniqId) => {
  return application(uniqId, { 'Listing': { 'Id': uniqId }} )
}

const listing = (uniqId) => {
  return {
    'Id': uniqId,
    'Name': 'xxx2'
  }
}

const listingFields = () => {
  return {
    "Id":null,
    "Name":{
      "label":"Listing Name",
      "minWidth":225
    },
    "Application_Due_Date":{
      "type":"date"
    },
    "Lottery_Date":{
      "type":"date"
    },
    "Lottery_Results_Date":{
      "type":"date"
    },
    "Lottery_Status":null,
    "nFlagged_Applications":{
      "label":"Flagged Applications"
    },
    "In_Lottery":{
      "label":"Applications In Lottery"
    }
  }
}

const listingsList = () => {
  return [
    {"Id":"a0W0x0000005q5MEAQ","Name":"Krissy New Listing 4/5","Application_Due_Date":"04/12/18","Lottery_Date":null,"Lottery_Results_Date":null,"Lottery_Status":"Not Yet Run","nFlagged_Applications":0,"In_Lottery":0},
    {"Id":"a0W0x000000FeCGEA0","Name":"Krissy Test 411","Application_Due_Date":"06/28/18","Lottery_Date":null,"Lottery_Results_Date":null,"Lottery_Status":"Not Yet Run","nFlagged_Applications":1,"In_Lottery":4},{"Id":"a0W0x000000GHiFEAW","Name":"Automated Test Listing Senior All (please do not modify)","Application_Due_Date":"01/01/21","Lottery_Date":"01/22/21","Lottery_Results_Date":"03/23/17","Lottery_Status":"Not Yet Run","nFlagged_Applications":0,"In_Lottery":0},
    {"Id":"a0W0x000000Fg6jEAC","Name":"Krissy 4/13","Application_Due_Date":"05/04/18","Lottery_Date":null,"Lottery_Results_Date":null,"Lottery_Status":"Not Yet Run","nFlagged_Applications":0,"In_Lottery":1},
    {"Id":"a0W0x000000G5fTEAS","Name":"test 2","Application_Due_Date":null,"Lottery_Date":null,"Lottery_Results_Date":null,"Lottery_Status":"Not Yet Run","nFlagged_Applications":0,"In_Lottery":0},{"Id":"a0W0x000000G5fOEAS","Name":"test","Application_Due_Date":null,"Lottery_Date":null,"Lottery_Results_Date":null,"Lottery_Status":"Not Yet Run","nFlagged_Applications":0,"In_Lottery":0},
    {"Id":"a0W0P00000DZJSTUA5","Name":"2235 Third (Potrero Launch) Unit  W519","Application_Due_Date":"02/17/17","Lottery_Date":"02/28/17","Lottery_Results_Date":"03/02/17","Lottery_Status":"Not Yet Run","nFlagged_Applications":0,"In_Lottery":0},
    {"Id":"a0W0P00000DZJSdUAP","Name":"2235 Third (Potrero Launch) Unit E408","Application_Due_Date":"02/17/17","Lottery_Date":"02/28/17","Lottery_Results_Date":"03/02/17","Lottery_Status":"Not Yet Run","nFlagged_Applications":0,"In_Lottery":0},
    {"Id":"a0W0P00000DZKPdUAP","Name":"2660 Third (Abaca)","Application_Due_Date":"03/10/17","Lottery_Date":"03/31/17","Lottery_Results_Date":"04/07/17","Lottery_Status":"Lottery Complete","nFlagged_Applications":0,"In_Lottery":2907},
    {"Id":"a0W0P00000F7t4uUAB","Name":"Merry Go Round Shared Housing","Application_Due_Date":"02/08/18","Lottery_Date":"02/28/18","Lottery_Results_Date":"03/01/18","Lottery_Status":"Lottery Complete","nFlagged_Applications":58,"In_Lottery":562},
    {"Id":"a0W0P00000F7wvrUAB","Name":"Pierce Street Apartments","Application_Due_Date":"01/31/18","Lottery_Date":"02/20/18","Lottery_Results_Date":"02/20/18","Lottery_Status":"Lottery Complete","nFlagged_Applications":98,"In_Lottery":1306}
  ]
}

const applicationFields = () => {
  return {
    Id:null,
    'Listing.Name': {
      label:"Listing Name"
    },
    Rule_Name: null,
    Total_Number_of_Duplicates: null
  }
}

const applicationsList = () => {
  return [
    { Id: "a0r0x000002BhjHAAS", 'Listing.Name': "TEST Listing", Rule_Name: "Residence Address", Total_Number_of_Duplicates: 1 },
    { Id: "a0r0x000002BhjHAAS", 'Listing.Name': "TEST Listing", Rule_Name: "Residence Address", Total_Number_of_Duplicates: 1 }
  ]
}

export default {
  application,
  applicationWithListing,
  listing,
  listingFields,
  listingsList,
  applicationsList,
  applicant,
  applicationWithApplicant,
  applicationFields
}
