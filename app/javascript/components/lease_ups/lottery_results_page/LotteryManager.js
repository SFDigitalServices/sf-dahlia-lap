import React, { useRef } from 'react'

import { useReactToPrint } from 'react-to-print'

import Loading from 'components/molecules/Loading'

import { LotteryResults } from './LotteryResults'
import { processLotteryBuckets, massageLotteryBuckets } from './utils/processLotteryBuckets'

const LotteryManager = ({ applications, listing, withLotteryResultApi }) => {
  // set up print component
  const componentToPrint = useRef(null)
  const handlePrint = useReactToPrint({
    documentTitle: 'Lottery Results',
    removeAfterPrint: true
  })

  // process applications into buckets, collecting anything the housing team
  // should look at before sharing the results
  const warnings = []
  let processedBuckets = null
  if (withLotteryResultApi && applications) {
    processedBuckets = massageLotteryBuckets(applications, warnings)
  } else if (applications) {
    processedBuckets = processLotteryBuckets(applications, warnings)
  }

  return (
    <>
      {processedBuckets ? (
        <>
          {warnings.length > 0 && (
            // deliberately outside the printed component: these may be known
            // and ignorable for a given listing, and shouldn't reach the PDF
            <div id='lottery-results-warnings' className='alert-notice alert'>
              <p className='t-tiny c-alert margin-bottom'>
                Check these lottery results before sharing them
              </p>
              <ul>
                {warnings.map((warning) => (
                  <li key={warning} className='t-tiny c-steel'>
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div id='save-lottery-results-button-container'>
            <button
              onClick={() => {
                handlePrint(null, () => componentToPrint.current)
              }}
            >
              Save Lottery Results
            </button>
          </div>
          <LotteryResults
            ref={componentToPrint}
            name={listing.name}
            address={listing.building_street_address}
            buckets={processedBuckets}
          />
        </>
      ) : (
        <Loading isLoading />
      )}
    </>
  )
}

export default LotteryManager
