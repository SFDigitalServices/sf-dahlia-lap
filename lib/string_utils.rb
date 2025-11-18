# frozen_string_literal: true

# Add icons to comments
module StringUtils
  def self.adorn_comment_icons(comment)
    case comment
    when /Invite to apply/
      "✉️ #{comment}"
    when /Check for docs: showed interest/
      "📁 #{comment}"
    else
      comment
    end
  end
end
