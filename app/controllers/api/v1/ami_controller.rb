# frozen_string_literal: true

module Api::V1
  # API to query for Area Median Income values
  class AmiController < ApiController
    def get
      ami = ami_service.ami(ami_params)
      render json: { ami: ami }
    end

    def ami_service
      Force::AmiService.new(current_user)
    end

    def ami_params
      params.permit(:chartType, :year, :percent)
    end
  end
end
