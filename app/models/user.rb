# User ouath class functions
class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable
  devise :omniauthable, :trackable

  def self.from_omniauth(auth)
    # To do: Need to find out why provider, uid and email have to be unique (acc to Migrations)
    user = User.where(provider: auth.provider, uid: auth.uid).first ||
           User.where(email: auth.info.email).first || User.new
    user.provider = auth.provider
    user.uid = auth.uid
    user.salesforce_user_id = auth.extra.user_id
    user.email = auth.info.email
    user.oauth_token = auth.credentials.token
    # have to do a separate lookup to grab the AccountId
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
