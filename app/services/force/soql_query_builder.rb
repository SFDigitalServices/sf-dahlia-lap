# frozen_string_literal: true

module Force
  # Build simple SOQL queries to access data in Salesforce
  class SoqlQueryBuilder
    DEFAULT_PAGE_SIZE = 100

    attr_reader :client

    def initialize(client)
      @client = client
      @where = []
    end

    ################################
    # BUILDER
    ################################

    def select(*select)
      @select = Array(select).join(', ')
      self
    end

    def from(from)
      @from = from
      self
    end

    def where(where)
      @where << where
      self
    end

    def where_contains(field, value)
      where("#{field} like '%#{value}%'")
      self
    end

    def where_eq(field, value, type = nil)
      where("#{field} = #{_format_value(type, value)}")
      self
    end

    def where_not_in(field, list)
      where("#{field} NOT IN (#{list.join(',')})")
      self
    end

    def all
      @page = nil
      @per_page = nil
    end

    # page: num, per: num
    def paginate(options)
      if options.present?
        @page = options[:page] || 0
        @per_page = options[:per_page] || DEFAULT_PAGE_SIZE
      else
        @page = 0
        @per_page = DEFAULT_PAGE_SIZE
      end
      self
    end

    def order_by(*field)
      @order_by = Array(field).join(', ')
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
      @page
    end

    def page_size
      @per_page
    end

    def pages
      total_size.to_f / page_size.to_f
    end

    def paginate?
      @page.present?
    end

    def order_by?
      @order_by.present?
    end

    ################################
    # EXECUTE
    ################################

    def total_size
      @total_size ||= @client.query(_count_soql).size
    end

    def query
      soql = _query_soql

      puts "[SOQL] #{soql}" if Rails.env.development?

      records = @client.query(soql)
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
      offset = @page.to_i * limit
      "LIMIT #{limit} OFFSET #{offset}"
    end

    def _query_soql
      query_str = ''
      query_str += "SELECT #{@select} #{_from_soql}"
      query_str += " ORDER BY #{@order_by}" if order_by?
      query_str += " #{_paginate_soql}" if paginate?
      query_str
    end

    def _count_soql
      "SELECT count() #{_from_soql}"
    end

    def _from_soql
      _from = "FROM #{@from}"
      _from += " WHERE #{_where_soql}" unless _where_soql.empty?
      _from
    end

    def _where_soql
      @where.map { |a| "(#{a})" }.join(' AND ')
    end

    def _result(records, pages = nil, page = nil)
      records = @transform_results.call(records) if @transform_results.present?

      Hashie::Mash.new(
        records: records,
        pages: pages,
        page: page,
        total_size: total_size,
      )
    end

    def _format_value(type, value)
      case type.to_s.to_sym
      when :string
        "'#{value}'"
      else
        value
      end
    end
  end
end
