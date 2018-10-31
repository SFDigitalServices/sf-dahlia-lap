# frozen_string_literal: true

# View helpers
module ApplicationHelper
  def salesforce_provider
    ENV['production'] ? :salesforce : :salesforcesandbox
  end

  def active_path(test_path)
    request.fullpath == test_path ? 'active' : ''
  end
end
