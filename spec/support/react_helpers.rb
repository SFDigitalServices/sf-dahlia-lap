module ReactHelpers
  # This could be a matcher
  def has_react_component(body, component)
    expect(body).to have_css("div[data-react-class=\"#{component}\"]", count: 1)
  end
end
