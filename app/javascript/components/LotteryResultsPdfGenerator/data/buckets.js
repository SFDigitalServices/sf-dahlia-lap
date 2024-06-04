import { Bucket } from './Bucket'

export default new Bucket('/', [
  new Bucket('COP', ['COP'], [new Bucket('V-COP', ['VET']), new Bucket('COP')]),
  new Bucket('DTHP', ['DTHP'], [new Bucket('V-DTHP', ['VET']), new Bucket('DTHP')]),
  new Bucket('NRHP', ['NRHP'], [new Bucket('V-NRHP', ['VET']), new Bucket('NRHP')]),
  new Bucket('LW', ['LW'], [new Bucket('V-LW', ['VET']), new Bucket('LW')]),
  // we want to include only applicants that have no preferences in this bucket
  new Bucket('General List', [({ prefs }) => Object.values(prefs).every((value) => !value)])
])
