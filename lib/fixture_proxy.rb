# frozen_string_literal: true

# Rack middleware that serves static JSON fixtures in place of live Salesforce
# API responses, so that UI work can be done locally without any Salesforce
# credentials or network access.
#
# Enabled only when SF_FIXTURES is set AND we're in the development
# environment. See script/fixtures/README.md for the capture workflow.
#
# GET  /api/v1/<path>?<query>  ->  tmp/fixtures/<path>__<sorted query>.json
# other verbs                  ->  200 {} (so optimistic UI flows can advance)
class FixtureProxy
  PREFIX = '/api/v1'
  JSON_HEADERS = { 'Content-Type' => 'application/json' }.freeze

  def initialize(app)
    @app = app
  end

  def call(env)
    request = Rack::Request.new(env)
    return @app.call(env) unless request.path.start_with?(PREFIX)

    # Writes never reach Salesforce in fixture mode. Returning an empty object
    # lets the UI proceed past a save without pretending we persisted anything.
    unless request.get?
      log "#{request.request_method} #{request.path} -> stubbed {}"
      return [200, JSON_HEADERS.dup, ['{}']]
    end

    name = fixture_name(request)
    file = fixture_root.join("#{name}.json")

    if file.file?
      log "#{request.fullpath} -> #{file.basename}"
      [200, JSON_HEADERS.dup, [file.read]]
    else
      # The miss message is the discovery mechanism: hit the page, read the
      # log, and capture exactly the fixtures it names.
      log "MISS #{request.fullpath} -> expected tmp/fixtures/#{name}.json"
      [404, JSON_HEADERS.dup, [{ message: "No fixture: #{name}.json" }.to_json]]
    end
  end

  # Turns a request into a filesystem-safe fixture name. Query params are
  # sorted so that param order doesn't change the name.
  #
  #   /api/v1/lottery-results?listing_id=a0W123
  #     -> "lottery-results__listing_id=a0W123"
  def self.fixture_name(path, query_string)
    path = path.sub(%r{\A#{Regexp.escape(PREFIX)}/?}, '').sub(%r{/\z}, '')
    params = Rack::Utils.parse_query(query_string.to_s)
                        .sort
                        .map { |key, value| "#{key}=#{Array(value).join(',')}" }
                        .join('&')
    name = params.empty? ? path : "#{path}__#{params}"
    name.gsub(%r{[^a-zA-Z0-9/=&_.,-]}, '_')
  end

  def self.fixture_root
    Rails.root.join('tmp/fixtures')
  end

  private

  def fixture_name(request)
    self.class.fixture_name(request.path, request.query_string)
  end

  def fixture_root
    self.class.fixture_root
  end

  def log(message)
    Rails.logger.info "[FixtureProxy] #{message}"
  end
end
