module Force
  # Encapsulate all Salesforce Lease__c querying and updating functions.
  class LeaseService < Force::Base
    def lease(application_id)
      builder.from(:Lease__c)
             .select(:Id,
                     :Unit__c,
                     :Lease_Start_Date__c,
                     :Lease_Status__c,
                     :Monthly_Parking_Rent__c,
                     :Preference_Used__c,
                     :No_Preference_Used__c,
                     :Total_Monthly_Rent_without_Parking__c,
                     :Monthly_Tenant_Contribution__c)
             .where_eq(:Application__c, application_id, :string)
             .transform_results { |results| massage(results) }
             .query
             .records
             .first
    end

    def submit_lease(lease, application_id, primary_contact_id)
      if lease[:id]
        response = update_lease(lease, application_id)
      else
        response = create_lease(lease, application_id, primary_contact_id)
      end
      response
    end

    private

    def create_lease(lease, application_id, primary_contact_id)
      create_lease_params = lease_base_params(lease, application_id).merge(Tenant__c: primary_contact_id, Lease_Status__c: 'Draft')
      @client.create!('Lease__c', create_lease_params)
    end

    def update_lease(lease, application_id)
      create_lease_params = lease_base_params(lease, application_id).merge(Id: lease[:id])
      @client.update!('Lease__c', create_lease_params)
    end

    def lease_base_params(lease, application_id)
      {
        Application__c: application_id,
        Unit__c: lease[:unit],
        Lease_Start_Date__c: lease[:leaseStartDate],
        Monthly_Parking_Rent__c: lease[:monthlyParkingRent],
        Preference_Used__c: lease[:preferenceUsed],
        # Salesforce require true/false for No_Preference_Used__c even if field was untouched
        No_Preference_Used__c: lease[:noPreferenceUsed].nil? ? false : lease[:noPreferenceUsed],
        Total_Monthly_Rent_without_Parking__c: lease[:totalMonthlyRentWithoutParking],
        Monthly_Tenant_Contribution__c: lease[:monthlyTenantContribution],
      }
    end
  end
end
