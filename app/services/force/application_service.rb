module Force
  # encapsulate all Salesforce Short Form Application querying functions
  class ApplicationService < Force::Base
    DRAFT = 'Draft'.freeze
    FIELDS = Hashie::Mash.load("#{Rails.root}/config/salesforce/fields.yml")['applications'].freeze

    def applications
      # TO DO: Cache this request
      parsed_index_query(%(
        SELECT #{query_fields(:index)}
        FROM Application__c
        WHERE #{user_can_access}
        AND Status__c != '#{DRAFT}'
      ))
    end

    def application(id)
      application = query_first(%(
        SELECT #{query_fields(:show)}
        FROM Application__c
        WHERE Id = '#{id}'
        AND Status__c != '#{DRAFT}'
        AND #{user_can_access}
      ))
      application['preferences'] = app_preferences(id)
      application['proof_files'] = app_proof_files(id)
      application['household_members'] = app_household_members(application)
      application['flagged_applications'] = flagged_record_set(id)
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

    def update(data)
      data = Hashie::Mash.new(data)
      return nil unless data[:Id]
      puts "updating #{data.as_json}"
      @client.update('Application__c', data)
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
        { Id: file.Id, Name: attachment.Name }
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
  end
end
