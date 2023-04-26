# frozen_string_literal: true

module Force
  module CustomApi
    # Provide Salesforce custom API interactions for rental assistances
    class LendingInstitutionsService < Force::Base
      def lending_institutions
        self.class.lending_institutions(@client)
      end

      def find_agent(agent_id)
        lending_institutions.each_with_object({}) do |institution, memo|
          agent = institution.last.find { |a| a['Id'] == agent_id }
          if agent.present?
            memo[:lending_institution] = institution.first
            memo[:name_of_lender] = "#{agent['FirstName']} #{agent['LastName']}"
          end
        end
      end

      # Lending institutions are memoized on class level. Once loaded, they will not be updated till server reboot.
      def self.lending_institutions(client)
        return @institutions if @institutions

        Rails.logger.info 'Fetching Lending Institutions from SalesForce.'
        response = client.get('/services/apexrest/agents/').body
        @institutions = map_institutions(response)
      end

      def self.map_agent(agent)
        return unless agent.present? && agent['BMR_Certified__c']

        status = agent['Lending_Agent_Status__c'].present? &&
                 agent['Lending_Agent_Status__c'] == 'Active'
        agent.slice('Id', 'FirstName', 'LastName').merge('Active' => status)
      end
      private_class_method :map_agent

      def self.map_institution_agents(institution)
        return unless institution['Contacts']

        institution['Contacts'].each_with_object([]) do |agent, arr|
          arr << map_agent(agent)
          arr
        end.compact
      end
      private_class_method :map_institution_agents

      def self.map_institutions(data)
        return [] unless data

        data.each_with_object({}) do |institution, institutions|
          agents = map_institution_agents(institution)
          institutions[institution['Name']] = agents unless agents.blank?
          institutions
        end
      end
      private_class_method :map_institutions
    end
  end
end
