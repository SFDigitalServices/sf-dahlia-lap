export const detailsFields = [
  { field: 'owner', label: 'Owner' },
  'name',
  { field: 'account', label: 'Account' },
  'application_due_date',
  { field: 'in_lottery', label: 'Applications in Lottery' },
  'status',
  'lottery_winners',
  'lottery_results'
]

export const buildingInformationFields = [
  'building_name',
  'building_street_address',
  'building_city',
  'building_state',
  'building_zip_code',
  'neighborhood',
  'developer',
  { field: 'building_url', label: 'Building URL' },
  'year_built',
  'description',
  'lottery_preferences'
]

export const lotteryPreferencesFields = [
  { field: 'lottery_preference.name', label: 'Name' },
  'description',
  { field: 'pdf_url', label: 'PDF URL' },
  'order',
  'available_units'
]

export const aafFields = [
  'accessibility',
  'fee',
  'amenities',
  { field: 'deposit_min', formatType: 'currency' },
  { field: 'deposit_max', formatType: 'currency' },
  'costs_not_included'
]

export const lotteryInfoFields = [
  'lottery_date',
  'lottery_results_date',
  'lottery_venue',
  'lottery_status',
  'lottery_street_address',
  'lottery_summary',
  'lottery_city'
]

export const appInfoFields = [
  'application_phone',
  'office_hours',
  'application_organization',
  'application_street_address',
  'application_city',
  'application_state',
  'application_postal_code',
  { field: 'download_url', label: 'Download URL' }
]

export const agentDevInfoFields = [
  'leasing_agent_name',
  'leasing_agent_title',
  'leasing_agent_email',
  'leasing_agent_phone'
]

export const eligibilityRulesFields = [
  'building_selection_criteria',
  'eviction_history',
  'criminal_history',
  'credit_rating'
]

export const additionalInfoFields = [
  'required_documents',
  'smoking_policy',
  { field: 'legal_disclaimers', renderType: 'html' },
  'pet_policy'
]

export const openHousesFields = ['date', 'start_time', 'end_time']

export const infoSessionsFields = [
  'date',
  'start_time',
  'end_time',
  'venue',
  'street_address',
  'city'
]
