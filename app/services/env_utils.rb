# Utility for getting environment variables
module EnvUtils
  def self.get!(name)
    key = name.to_s
    raise "Environment variable '#{name}' is not set" unless ENV.key?(key)
    raise "Environment variable value for '#{name}' is empty" unless ENV[key].present?
    ENV[key]
  end
end
