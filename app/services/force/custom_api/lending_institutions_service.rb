# frozen_string_literal: true

module Force
  module CustomApi
    # Provide Salesforce custom API interactions for rental assistances
    class LendingInstitutionsService < Force::Base
      def lending_institutions
        return @institutions if @institutions

        response = @client.get('/services/apexrest/agents/').body
        @institutions = map_institutions(response)
      end

      private

      def map_agent(agent)
        return unless agent.present? && agent['BMR_Certified__c']

        status = agent['Lending_Agent_Status__c'].present? &&
                 agent['Lending_Agent_Status__c'] == 'Active'
        agent.slice('Id', 'FirstName', 'LastName').merge('Active' => status)
      end

      def map_institution_agents(institution)
        return unless institution['Contacts']

        institution['Contacts'].each_with_object([]) do |agent, arr|
          arr << map_agent(agent)
          arr
        end.compact
      end

      def map_institutions(data)
        return [] unless data

        data.each_with_object({}) do |institution, institutions|
          agents = map_institution_agents(institution)
          institutions[institution['Name']] = agents unless agents.blank?
          institutions
        end
      end
    end
  end
end
