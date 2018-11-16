# frozen_string_literal: true

module Force
  module Soql
    # Provide Salesforce SOQL API interactions for application status
    class ApplicationStatusService < Force::Base
      def last_updated_dates(application_ids)
        massage(query(%(
          SELECT MAX(Processing_Date_Updated__c) Status_Last_Updated, Application__c
          FROM Field_Update_Comment__c
          WHERE Application__c IN (#{application_ids.join(', ')})
          GROUP BY Application__c
        )))
      end
    end
  end
end
