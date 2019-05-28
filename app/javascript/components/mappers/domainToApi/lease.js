import { createFieldMapper } from '~/utils/objectUtils'
import { currencyToFloat } from '~/utils/utils'
import { isEmpty } from 'lodash'

// Lease is sent to backend with domain keys.
export const leaseFieldMapper = {
  'id': 'id',
  'lease_start_date': (source) => !isEmpty(source.lease_start_date) ? [source.lease_start_date.year, source.lease_start_date.month, source.lease_start_date.day] : ['', '', ''],
  'no_preference_used': 'no_preference_used',
  'preference_used': 'preference_used',
  'unit': 'unit',
  total_monthly_rent_without_parking: (source) => currencyToFloat(source.total_monthly_rent_without_parking),
  monthly_parking_rent: (source) => currencyToFloat(source.monthly_parking_rent),
  monthly_tenant_contribution: (source) => currencyToFloat(source.monthly_tenant_contribution)
}

export const mapLease = createFieldMapper(leaseFieldMapper)
