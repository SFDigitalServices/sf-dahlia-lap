# frozen_string_literal: true

module ReactHelpers
  # This could be a matcher
  def have_react_component(component)
    have_css("div[data-react-class=\"#{component}\"]", count: 1)
  end
end
