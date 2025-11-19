# frozen_string_literal: true

# Add icons to string
module StringUtils
  def self.adorn_with_icons(string)
    case string
    when /Invited to Apply/
      "✉️ #{string}"
    when /Check for docs: Showed interest/
      "📁 #{string}"
    else
      string
    end
  end
end
