# frozen_string_literal: true

module ControllerMacros
  def login_admin
    before(:each) do
      @request.env['devise.mapping'] = Devise.mappings[:user]
      @current_user = User.create!(email: 'admin@example.com', admin: true)
      sign_in @current_user
    end
  end

  def login_user
    before(:each) do
      @request.env['devise.mapping'] = Devise.mappings[:user]
      @current_user = User.create!(email: 'admin@example.com', admin: false)
      user = @current_user
      user.confirm! # or set a confirmed_at inside the factory. Only necessary if you are using the 'confirmable' module
      sign_in user
    end
  end
end
