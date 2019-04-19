# frozen_string_literal: true

# User ouath class functions
class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable
  devise :omniauthable, :trackable, :timeoutable

  # Overwrite needed to revoke Salesforce Token when user session times out
  # Warden::Manager.before_logout do |user, auth, opts|
  #   Force::Base.new(user).revoke_token
  #   @salesforce_logout_host = user.admin ? ENV['SALESFORCE_INSTANCE_URL'] : ENV['COMMUNITY_LOGIN_URL']
  #   p "WE ARE HERE"
  #   if @salesforce_logout_host
  #     # FIND OUT WHY THIS DOESN'T WORK.
  #     p HTTParty.get("#{@salesforce_logout_host}/secur/logout.jsp")
  #   end
  # end

  def self.from_omniauth(auth)
    user = User.where(provider: auth.provider, uid: auth.uid, email: auth.extra.username).first ||
           User.new
    user.provider = auth.provider
    user.uid = auth.uid
    user.salesforce_user_id = auth.extra.user_id
    user.email = auth.extra.username
    user.oauth_token = auth.credentials.token
    # have to do a separate lookup to grab the Salesforce AccountId
    service = Force::UserService.new(user)
    service.load_user
    user.salesforce_account_id = service.account_id
    user.admin = service.admin
    # always update oauth_token regardless of new_record or not
    user.oauth_token = auth.credentials.token
    user.save
    user
  end
end
