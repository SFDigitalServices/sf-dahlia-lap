export const mapLease = (lease) => {
  return {
    id: lease.Id,
    unit: lease.Unit,
    lease_status: lease.Lease_Status,
    lease_start_date: lease.Lease_Start_Date,
    monthly_parking_rent: lease.Monthly_Parking_Rent,
    preference_used: lease.Preference_Used,
    no_preference_used: lease.No_Preference_Used,
    total_monthly_rent_without_parking: lease.Total_Monthly_Rent_without_Parking,
    monthly_tenant_contribution: lease.Monthly_Tenant_Contribution
  }
}
