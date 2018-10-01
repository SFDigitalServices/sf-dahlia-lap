module Force
  # Salesforce SOQL API and Custom API for applications
  class ApplicationService < Force::Base
    DRAFT = 'Draft'.freeze
    FIELD_NAME = :applications
    FIELDS = load_fields(FIELD_NAME).freeze

    def applications(opts = { page: 0 })
      query_scope = builder.from(:Application__c)
                           .select(query_fields(:index))
                           .where(user_can_access)
                           .where("Status__c != '#{DRAFT}'")
                           .paginate(opts)
                           .transform_results { |results| massage(results) }

      query_scope.where_contains(:Name, opts[:application_number]) if opts[:application_number].present?
      query_scope.where_eq('Listing__r.Id', "'#{opts[:listing]}'") if opts[:listing].present?
      query_scope.where_eq('Applicant__r.First_Name__c', "'#{opts[:first_name]}'") if opts[:first_name].present?
      query_scope.where_eq('Applicant__r.Last_Name__c', "'#{opts[:last_name]}'") if opts[:last_name].present?
      query_scope.where_eq('Application_Submission_Type__c', "'#{opts[:submission_type]}'") if opts[:submission_type].present?

      query_scope.query
    end

    def application(id, options = {})
      includes = options[:includes] || %w[preferences proof_files household_members flagged_applications]

      application = query_first(%(
        SELECT #{query_fields(:show)}
        FROM Application__c
        WHERE Id = '#{id}'
        AND Status__c != '#{DRAFT}'
        AND #{user_can_access}
      ))
      application['preferences'] = app_preferences(id) if includes.include?('preferences')
      application['proof_files'] = app_proof_files(id) if includes.include?('proof_files')
      application['household_members'] = app_household_members(application) if includes.include?('household_members')
      application['flagged_applications'] = flagged_record_set(id) if includes.include?('flagged_applications')
      application['lease'] = lease_service.lease(id) if includes.include?('lease')
      application
    end

    def listing_applications(listing_id)
      # NOTE: most listings are <5000 but a couple have been in the 5000-7000 range
      # pro of doing mega-query: can do client side searching/sorting
      # con: loading a JSON of 7500 on the page, performance?
      massage(query(%(
        SELECT #{query_fields(:index)}
        FROM Application__c
        WHERE #{user_can_access}
        AND Status__c != '#{DRAFT}'
        AND Listing__r.Id='#{listing_id}'
        LIMIT 10000
      )))
    end

    def submit(data)
      api_post('/LeasingAgentPortal/shortForm', application_defaults.merge(data))
    end

    private

    def app_household_members(application)
      alternate_contact_id = application.Alternate_Contact ? application.Alternate_Contact.Id : nil
      parsed_index_query(%(
        SELECT #{query_fields(:show_household_members)}
        FROM Application_Member__c
        WHERE Application__c = '#{application.Id}'
        AND Id != '#{application.Applicant.Id}'
        AND Id != '#{alternate_contact_id}'
      ), :show_household_members)
    end

    def app_preferences(application_id)
      parsed_index_query(%(
        SELECT #{query_fields(:show_preference)}
        FROM Application_Preference__c
        WHERE Application__c = '#{application_id}'
      ), :show_preference)
    end

    def app_proof_files(application_id)
      parsed_index_query(%(
        SELECT #{query_fields(:show_proof_files)}
        FROM Attachment__c
        WHERE Related_Application__c = '#{application_id}'
      ), :show_proof_files).map do |attachment|
        file = query_first(%(
          SELECT Id
          FROM Attachment
          WHERE ParentId = '#{attachment.Id}'
        ))
        {
          Id: file.Id,
          Document_Type: attachment.Document_Type,
          Related_Application: attachment.Related_Application,
          Related_Application_Preference: attachment.Related_Application_Preference,
        }
      end
    end

    def flagged_record_set(application_id)
      parsed_index_query(%(
        SELECT #{query_fields(:show_flagged_records)}
        FROM Flagged_Application__c
        WHERE Application__c  = '#{application_id}'
      ), :show_flagged_records)
    end

    def application_defaults
      {
        applicationSubmissionType: 'Paper',
        applicationSubmittedDate: Time.now.strftime('%F'), # YYYY-MM-DD
        status: 'Submitted',
      }
    end

    def user_can_access
      if @user.admin?
        # HACK: return truthiness (e.g. "1=1" in MySQL)
        'Id != null'
      else
        # for community users, restrict results to their account + draft
        %(Listing__r.Account__c = '#{@user.salesforce_account_id}')
      end
    end

    def lease_service
      Force::LeaseService.new(@user)
    end
  end
end
