if defined?(PryByebug)
  Pry.commands.alias_command 'c', 'continue'
  Pry.commands.alias_command 's', 'step'
  Pry.commands.alias_command 'n', 'next'
  Pry.commands.alias_command 'f', 'finish'

  Pry::Commands.command /^$/, "repeat last command" do
   _pry_.run_command Pry.history.to_a.last
 end
end

if defined?(PryRails::RAILS_PROMPT)
  Pry.config.prompt = PryRails::RAILS_PROMPT
end

if defined? AwesomePrint
  AwesomePrint.pry!
  ## The following line enables awesome_print for all pry output,
  # and enables paging using Pry's pager with awesome_print.
  Pry.config.print = proc {|output, value| Pry::Helpers::BaseHelpers.stagger_output("=> #{value.ai(indent: 2)}", output)}
  ## If you want awesome_print without automatic pagination, use below:
  # Pry.config.print = proc { |output, value| output.puts value.ai }
end

# Search method on Pry 
# class Object
#   def search_methods(qry)
#       self.methods & self.methods.select { |m| m.to_s.include?(qry.to_s) }
#   end
# end
