import { createFieldMapper } from '~/utils/objectUtils'

export const leaseFieldMapper = {
  id: 'id',
  unit: 'unit',
  lease_status: 'leaseStatus',
  lease_start_date: 'leaseStartDate',
  monthly_parking_rent: 'monthlyParkingRent',
  total_monthly_rent_without_parking: 'totalMonthlyRentWithoutParking',
  monthly_tenant_contribution: 'monthlyTenantContribution'
}

export const mapLease = createFieldMapper(leaseFieldMapper)
