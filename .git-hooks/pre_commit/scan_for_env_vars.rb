# frozen_string_literal: true

require 'dotenv/parser'

module Overcommit
  module Hook
    module PreCommit
      # Custom Overcommit pre-commit filter to scan for any uses of environment
      # variable values in committed code and warn about them so they can be
      # removed. Uses the dotenv gem's parser to read in the vars from .env.
      class ScanForEnvVars < Base
        def run
          ignore_vars = ['SALESFORCE_API_VERSION']
          env_vars = Dotenv::Parser.call(File.read('.env'))
          ignore_vars.each { |var| env_vars.delete(var) }
          errors = []

          applicable_files.each do |file|
            env_vars.each do |name, val|
              File.foreach(file) do |line|
                if line.include?(val)
                  errors << "#{file}: File contains the value of the environment variable #{name}. " \
                  "Please replace with a reference to the #{name} variable.)"
                  break
                end
              end
            end
          end

          return :fail, errors.join("\n") if errors.any?

          :pass
        end
      end
    end
  end
end
