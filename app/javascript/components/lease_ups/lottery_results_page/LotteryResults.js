import React, { useState } from 'react'

import EasyEdit from 'react-easy-edit'

import LotteryBuckets from './LotteryBuckets'

export const LotteryResults = React.forwardRef(({ name, address, buckets }, ref) => {
  const [currentName, setCurrentName] = useState(name)
  const [currentAddress, setCurrentAddress] = useState(address)
  const [currentDate, setCurrentDate] = useState(new Date().toDateString())

  return (
    <article id='lottery-results-pdf-generator-main' ref={ref}>
      <header id='lottery-results-header'>
        <h1>
          {"Mayor's Office of Housing and Community Development"}
          <br />
          <img
            src='https://www.sf.gov/static/CCSF-seal-vector.svg'
            alt='SF'
            id='lottery-results-seal'
          />
        </h1>
        <h2>
          <EasyEdit type='text' value={currentName} onSave={setCurrentName} />
        </h2>
        <h3>
          <EasyEdit type='text' value={currentAddress} onSave={setCurrentAddress} />
        </h3>
        <h3>
          Lottery date: <EasyEdit type='text' value={currentDate} onSave={setCurrentDate} />
        </h3>
        <blockquote>
          <h4>
            Press <kbd>ctrl</kbd>
            <kbd>F</kbd> and enter your lottery ticket number to find your rank
          </h4>
          <h5>* indicates a US Military Veteran</h5>
        </blockquote>
      </header>
      <LotteryBuckets buckets={buckets} />
    </article>
  )
})
