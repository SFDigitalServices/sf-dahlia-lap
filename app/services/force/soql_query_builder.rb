module Force
  class SoqlQueryBuilder
    DEFAULT_PAGE_SIZE = 25

    attr_reader :client
    def initialize(client)
      @client = client
    end

    ################################
    # BUILDER
    ################################

    def select(select)
      @select = select
      self
    end

    def from(from)
      @from = from
      self
    end

    def where(where)
      @where = where
      self
    end

    # page: num, per: num
    def paginate(options)
      @paginate = options
      self
    end

    def transform_results(&block)
      @transform_results = block
      self
    end

    ################################
    # GETTERS
    ################################

    def current_page
      @paginate[:page] if @paginate.present?
    end

    def page_size
      @paginate[:per] || DEFAULT_PAGE_SIZE if @paginate.present?
    end

    def pages
      total_size / page_size
    end

    def paginate?
      @paginate.present?
    end

    ################################
    # EXECUTE
    ################################

    def total_size
      @total_size ||= @client.query(_count_soql).size
    end

    def query
      records = @client.query(_query_soql)
      if paginate?
        _result records, pages, current_page
      else
        _result records
      end
    end

    def to_s
      _query_soql
    end

    def to_soql
      _query_soql
    end

    ################################
    # SOQL
    ################################

    def _paginate_soql
      limit = page_size
      offset = @paginate[:page].to_i * limit
      "LIMIT #{limit} OFFSET #{offset}"
    end

    def _query_soql
      query_str = ""
      query_str += "SELECT #{@select} #{_from_soql}"
      query_str += " #{_paginate_soql}" if paginate?
      query_str
    end

    def _count_soql
      "SELECT count() #{_from_soql}"
    end

    def _from_soql
      "FROM #{@from} WHERE #{@where}"
    end

    def _result(records, pages = nil, page = nil )
      records = @transform_results.call(records) if @transform_results.present?

      Hashie::Mash.new({
        records: records,
        pages: pages,
        page: page, 
        total_size: total_size
      })
    end

  end
end
