import { createFieldMapper } from '~/utils/objectUtils'

export const rentalAssistancesFieldMapper = {
  assistance_amount: 'assistanceAmount',
  id: 'id',
  lease: 'lease',
  other_assistance_name: 'otherAssistanceName',
  recipient: 'recipient',
  recurring_assistance: 'recurringAssistance',
  type_of_assistance: 'typeOfAssistance'
}

export const mapRentalAssistance = createFieldMapper(rentalAssistancesFieldMapper)
