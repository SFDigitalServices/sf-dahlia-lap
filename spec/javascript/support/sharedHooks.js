import sinon from 'sinon'

const useFakeTimers = () => {
  let clock = null

  beforeAll(() => {
    clock = sinon.useFakeTimers(new Date(2018, 3, 23, 0, 0, 0, 0).getTime());
  });

  afterAll(() => {
    clock.restore();
  })
}

export default {
  useFakeTimers
}
