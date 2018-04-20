import React from 'react'

const TablePagination = ({ pages }) => {
  return (
    <nav className="table-pagination" role="navigation">
      <div className="table-pagination_action">
        <button className="button tertiary" disabled type="button" data-event="">Previous</button> </div>
      <div className="table-pagination_center">
        <span className="table-pagination_pagesize">
          Show
          <span className="table-pagination_pagerows">
            <select name="rows" id="rows" class="" data-width="auto">
              <option value="">20 rows</option>
                <option value="5-rows">5 rows</option>
                <option value="10-rows">10 rows</option>
                <option value="15-rows">15 rows</option>
                <option value="20-rows">20 rows</option>
                <option value="50-rows">50 rows</option>
                <option value="100-rows">100 rows</option>
            </select>
          </span>
        </span>
        <span className="table-pagination_pageinfo">
          Jump to page
          <span className="table-pagination_pagejump">
            <select name="page" id="page" class="" data-width="auto">
              <option value="">1</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
            </select>
          </span> {pages}
        </span>
      </div>
      <div className="table-pagination_action">
        <button className="button tertiary" type="button" data-event="">Next</button> </div>
    </nav>
  )
}

export default TablePagination