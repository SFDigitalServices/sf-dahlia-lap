# frozen_string_literal: true

module Force
  # encapsulate all Salesforce User querying functions
  class UserService < Force::Base
    COMMUNITY_USER_TYPE = 'PowerPartner'
    attr_accessor :account_id, :admin

    def initialize(user)
      @admin = false
      super(user)
    end

    def load_user
      result = query(%(
        SELECT UserType, AccountId
        FROM User WHERE Id='#{@user.salesforce_user_id}'
      )).first
      return nil unless result
      # NOTE: this is a different way to determine Community user vs. Admin than
      # on the Community Portal, which used `Profile`.
      # However, the community user didn't seem to have access to `Profile`
      # so couldn't even query for that field unless you were admin.
      @admin = result.UserType != COMMUNITY_USER_TYPE
      @account_id = result.AccountId
    end
  end
end
