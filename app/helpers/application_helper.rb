# View helpers
module ApplicationHelper
  def salesforce_provider
    ENV['production'] ? :salesforce : :salesforcesandbox
  end

  def clean_field(field)
    field.gsub('__c', '').tr('_', ' ')
  end

  def active_path(test_path)
    request.path == test_path ? 'active' : ''
  end
end
