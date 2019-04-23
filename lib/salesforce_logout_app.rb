# Handles Salesforce logouts when user session is timed out.
class SalesforceLougoutApp < Devise::FailureApp
  def redirect
    store_location!
    message = warden.message || warden_options[:message]

    # For some reason it also needs to be called when message is nil
    if message.nil? || message == :timeout
      @salesforce_logout_host = warden.params[:admin] ? ENV['SALESFORCE_INSTANCE_URL'] : ENV['COMMUNITY_LOGIN_URL']
      redirect_to "#{@salesforce_logout_host}/secur/logout.jsp" and return
    else
      super
    end
  end
end
