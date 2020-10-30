import { toRem } from '~/utils/cssUtils'

describe('toRem', () => {
  describe('with null or empty input', () => {
    test('converts undefined correctly', () => {
      expect(toRem(undefined)).toBeNull()
    })

    test('converts null correctly', () => {
      expect(toRem(null)).toBeNull()
    })

    test('converts empty string correctly', () => {
      expect(toRem('')).toBeNull()
    })
  })
  describe('with numbers', () => {
    test('converts 0 correctly', () => {
      expect(toRem(0)).toEqual('0rem')
    })

    test('converts 1 correctly', () => {
      expect(toRem(1)).toEqual('1rem')
    })

    test('converts -1 correctly', () => {
      expect(toRem(-1)).toEqual('-1rem')
    })

    test('converts 1.5 correctly', () => {
      expect(toRem(1.5)).toEqual('1.5rem')
    })
  })

  describe('with strings', () => {
    describe('when strings don’t have rem suffix', () => {
      test('converts "0" correctly', () => {
        expect(toRem('0')).toEqual('0rem')
      })

      test('converts "1" correctly', () => {
        expect(toRem('1')).toEqual('1rem')
      })

      test('converts "-1" correctly', () => {
        expect(toRem('-1')).toEqual('-1rem')
      })

      test('converts "1.5" correctly', () => {
        expect(toRem('1.5')).toEqual('1.5rem')
      })
    })

    describe('when strings have rem suffix', () => {
      test('converts "0rem" correctly', () => {
        expect(toRem('0rem')).toEqual('0rem')
      })

      test('converts "1rem" correctly', () => {
        expect(toRem('1rem')).toEqual('1rem')
      })

      test('converts "-1rem" correctly', () => {
        expect(toRem('-1rem')).toEqual('-1rem')
      })

      test('converts "1.5rem" correctly', () => {
        expect(toRem('1.5rem')).toEqual('1.5rem')
      })

      describe('when strings have px suffix', () => {
        test('converts "0px" correctly', () => {
          expect(toRem('0px')).toBeNull()
        })

        test('converts "1px" correctly', () => {
          expect(toRem('1px')).toBeNull()
        })

        test('converts "-1px" correctly', () => {
          expect(toRem('-1px')).toBeNull()
        })

        test('converts "1.5px" correctly', () => {
          expect(toRem('1.5px')).toBeNull()
        })
      })

      describe('when strings don’t contain a valid number', () => {
        test('converts "rem" correctly', () => {
          expect(toRem('rem')).toBeNull()
        })

        test('converts "apple" correctly', () => {
          expect(toRem('apple')).toBeNull()
        })

        test('converts "1rem2" correctly', () => {
          expect(toRem('1rem2')).toBeNull()
        })

        test('converts "1.2.3" correctly', () => {
          expect(toRem('1.2.3')).toBeNull()
        })
      })
    })
  })
})
