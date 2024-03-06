# frozen_string_literal: true

module ReactHelpers
  # This could be a matcher
  def have_react_component(component)
    have_css("div[id^=\"#{component}\"]", count: 1)
  end
end
