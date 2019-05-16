export const mapLease = (value) => {
  return {
    id: value.Id,
    lease_start_date: dateToDomain(value.lease_start_date),
    no_preference_used: value.no_preference_used,
    preference_used: value.preference_used,
    unit: value.unit,
    total_monthly_rent_without_parking: value.total_monthly_rent_without_parking,
    monthly_parking_rent: value.monthly_parking_rent,
    monthly_tenant_contribution: value.monthly_tenant_contribution
  }
}

const dateToDomain = (date) => {
  if (!date) return null
  return {year: date[0], month: date[1], day: date[2]}
}
