export const detailsFields = [
  { field: 'Owner.Name', label: 'Owner' },
  'Name',
  'Account.Name',
  'Application_Due_Date',
  { field: 'In_Lottery', label: 'Applications in Lottery' },
  'Status',
  'Lottery_Winners',
  'Lottery_Results',
]

export const buildingInformationFields = [
  'Building_Name',
  'Building_Street_Address',
  'Building_City',
  'Building_State',
  'Building_Zip_Code',
  'Neighborhood',
  'Developer',
  'Building_URL',
  'Year_Built',
  'Description',
  'Lottery_Preferences'
]

export const lotteryPreferencesFields = [
  'Lottery_Preference.Name',
  'Description',
  'PDF_URL',
  'Order',
  'Available_Units'
]

export const aafFields = [
  'Accessibility',
  'Fee',
  'Amenities',
  'Deposit_Min',
  'Deposit_Max',
  'Costs_Not_Included'
]

export const lotteryInfoFields = [
  'Lottery_Date',
  'Lottery_Results_Date',
  'Lottery_Venue',
  'Lottery_Status',
  'Lottery_Street_Address',
  'Lottery_Summary',
  'Lottery_City'
]

export const appInfoFields = [
  'Application_Phone',
  'Office_Hours',
  'Application_Organization',
  'Application_Street_Address',
  'Application_City',
  'Application_State',
  'Application_Postal_Code',
  'Organization_URL',
  'Download_URL'
]

export const agentDevInfoFields= [
  'Leasing_Agent_Name',
  'Leasing_Agent_Title',
  'Leasing_Agent_Email',
  'Leasing_Agent_Phone',
  'Preference_Detail'
]

export const eligibilityRulesFields = [
  'Building_Selection_Criteria',
  'Eviction_History',
  'Criminal_History',
  'Credit_Rating'
]

export const additionalInfoFields = [
  'Required_Documents',
  'Smoking_Policy',
  { field: 'Legal_Disclaimers', renderType: 'html' },
  'Pet_Policy'
]

export const openHousesFields = [
  'Date',
  'Start_Time',
  'End_Time'
]

export const infoSessionsFields = [
  'Date',
  'Start_Time',
  'End_Time',
  'Venue',
  'Street_Address',
  'City'
]
