module Force
  # encapsulate all Salesforce AMI querying functions
  class AmiService < Force::Base
    def ami(params)
      response = api_get('/ami', params)
      amis = []
      response.each do |ami|
        amis.push(householdSize: ami[:numOfHousehold], amount: ami[:amount])
      end
      amis
    end
  end
end
