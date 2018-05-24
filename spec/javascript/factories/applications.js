
const factory = {
  validApplication: (uniqId, attributes = {}) => {
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
  },

  validApplicationWithListing: (uniqId) => {
    return factory.validApplication(uniqId, { 'Listing': { 'Id': 1 } })
  }

}

export default factory
