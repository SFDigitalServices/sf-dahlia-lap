import { createFieldMapper } from '~/utils/objectUtils'
import { currencyToFloat } from '~/utils/utils'

// Lease is sent to backend with domain keys.
export const leaseFieldMapper = {
  'id': 'id',
  'lease_start_date': 'lease_start_date',
  'no_preference_used': 'no_preference_used',
  'preference_used': 'preference_used',
  'unit': 'unit',
  total_monthly_rent_without_parking: (source) => currencyToFloat(source.total_monthly_rent_without_parking),
  monthly_parking_rent: (source) => currencyToFloat(source.monthly_parking_rent),
  monthly_tenant_contribution: (source) => currencyToFloat(source.monthly_tenant_contribution),
  bmr_parking_space_assigned: 'bmr_parking_space_assigned'
}

export const mapLease = createFieldMapper(leaseFieldMapper)
