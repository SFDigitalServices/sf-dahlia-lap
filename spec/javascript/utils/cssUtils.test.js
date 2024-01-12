import { toRem, toPx } from 'utils/cssUtils'

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
      expect(toRem(0)).toBe('0rem')
    })

    test('converts 1 correctly', () => {
      expect(toRem(1)).toBe('1rem')
    })

    test('converts -1 correctly', () => {
      expect(toRem(-1)).toBe('-1rem')
    })

    test('converts 1.5 correctly', () => {
      expect(toRem(1.5)).toBe('1.5rem')
    })
  })

  describe('with strings', () => {
    describe('when strings don’t have rem suffix', () => {
      test('converts "0" correctly', () => {
        expect(toRem('0')).toBe('0rem')
      })

      test('converts "1" correctly', () => {
        expect(toRem('1')).toBe('1rem')
      })

      test('converts "-1" correctly', () => {
        expect(toRem('-1')).toBe('-1rem')
      })

      test('converts "1.5" correctly', () => {
        expect(toRem('1.5')).toBe('1.5rem')
      })
    })

    describe('when strings have rem suffix', () => {
      test('converts "0rem" correctly', () => {
        expect(toRem('0rem')).toBe('0rem')
      })

      test('converts "1rem" correctly', () => {
        expect(toRem('1rem')).toBe('1rem')
      })

      test('converts "-1rem" correctly', () => {
        expect(toRem('-1rem')).toBe('-1rem')
      })

      test('converts "1.5rem" correctly', () => {
        expect(toRem('1.5rem')).toBe('1.5rem')
      })

      describe('with uppercase REM suffix', () => {
        test('converts 1REM correctly', () => {
          expect(toRem('1REM')).toBe('1rem')
        })
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

describe('toPx', () => {
  describe('with null or empty input', () => {
    test('converts undefined correctly', () => {
      expect(toPx(undefined)).toBeNull()
    })

    test('converts null correctly', () => {
      expect(toPx(null)).toBeNull()
    })

    test('converts empty string correctly', () => {
      expect(toPx('')).toBeNull()
    })
  })

  describe('with numbers', () => {
    test('converts 0 correctly', () => {
      expect(toPx(0)).toBe('0px')
    })

    test('converts 1 correctly', () => {
      expect(toPx(1)).toBe('1px')
    })

    test('converts -1 correctly', () => {
      expect(toPx(-1)).toBe('-1px')
    })

    test('converts 1.5 correctly', () => {
      expect(toPx(1.5)).toBe('1.5px')
    })
  })

  describe('with strings', () => {
    describe('when strings don’t have px suffix', () => {
      test('converts "0" correctly', () => {
        expect(toPx('0')).toBe('0px')
      })

      test('converts "1" correctly', () => {
        expect(toPx('1')).toBe('1px')
      })

      test('converts "-1" correctly', () => {
        expect(toPx('-1')).toBe('-1px')
      })

      test('converts "1.5" correctly', () => {
        expect(toPx('1.5')).toBe('1.5px')
      })
    })

    describe('when strings have px suffix', () => {
      test('converts "0px" correctly', () => {
        expect(toPx('0px')).toBe('0px')
      })

      test('converts "1px" correctly', () => {
        expect(toPx('1px')).toBe('1px')
      })

      test('converts "-1px" correctly', () => {
        expect(toPx('-1px')).toBe('-1px')
      })

      test('converts "1.5px" correctly', () => {
        expect(toPx('1.5px')).toBe('1.5px')
      })

      describe('with uppercase PX suffix', () => {
        test('converts 1PX correctly', () => {
          expect(toPx('1PX')).toBe('1px')
        })
      })

      describe('when strings have rem suffix', () => {
        test('converts "0rem" correctly', () => {
          expect(toPx('0rem')).toBeNull()
        })

        test('converts "1rem" correctly', () => {
          expect(toPx('1rem')).toBeNull()
        })

        test('converts "-1rem" correctly', () => {
          expect(toPx('-1rem')).toBeNull()
        })

        test('converts "1.5rem" correctly', () => {
          expect(toPx('1.5rem')).toBeNull()
        })
      })

      describe('when strings don’t contain a valid number', () => {
        test('converts "px" correctly', () => {
          expect(toPx('px')).toBeNull()
        })

        test('converts "apple" correctly', () => {
          expect(toPx('apple')).toBeNull()
        })

        test('converts "1px2" correctly', () => {
          expect(toPx('1px2')).toBeNull()
        })

        test('converts "1.2.3" correctly', () => {
          expect(toPx('1.2.3')).toBeNull()
        })
      })
    })
  })
})
