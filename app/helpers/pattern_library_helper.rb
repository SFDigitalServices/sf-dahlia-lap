module PatternLibraryHelper
  def pl_component(component_name, args, options = {})
    render partial: 'pattern_library/component_template', locals: { component_name: component_name, args: args }
  end
end
