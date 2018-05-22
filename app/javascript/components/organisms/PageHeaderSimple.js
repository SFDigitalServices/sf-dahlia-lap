import React from 'react'

const PageHeaderSimple = ({ title }) => {
  return (
    <header className="lead-header short bg-vapor">
    	<div className="row full-width inner--3x">
    		<div className="large-12 columns ">
    			<hgroup className="lead-header_group">
    				<h1 className="lead-header_title small-serif c-oil">{title}</h1>
    			</hgroup>
    		</div>
    	</div>
    </header>
  )
}

export default PageHeaderSimple
