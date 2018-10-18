# frozen_string_literal: true

# Root controller from which all our API controllers inherit.
class ApiController < ActionController::API
  respond_to :json

  rescue_from Faraday::ClientError do |e|
    render_error(exception: e, status: :service_unavailable) # 503
  end

  def render_error(opts = {})
    opts = Hashie::Mash.new(opts)
    status = opts.status || :internal_server_error
    if opts.exception
      e = opts.exception
      message = "#{e.class.name}, #{e.message}"
    else
      message = 'Not found.'
    end
    logger.error "<< API Error >> #{message}"
    status_code = Rack::Utils::SYMBOL_TO_STATUS_CODE[status]
    render json: { message: message, status: status_code }, status: status
  end
end
