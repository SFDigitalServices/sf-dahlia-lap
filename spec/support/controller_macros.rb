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
      @current_user = User.create!(email: 'user@example.com', admin: false)
      sign_in @current_user
    end
  end
end
