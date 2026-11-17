import { describe, expect, test } from 'bun:test'
import { checkFacts, extractNumbers } from './fact-keep-check.mjs'

describe('fact-keep-check catches what an unsigned value-set check misses', () => {
  test('identical text passes', () => {
    const text = '성공 10건, 실패 2건이에요. 12:22 KST에 확인했어요.'
    expect(checkFacts(text, text).ok).toBe(true)
  })

  test('swapped counts fail as a pairing change', () => {
    const result = checkFacts('성공 10건, 실패 2건이에요.', '성공 2건, 실패 10건이에요.')
    expect(result.ok).toBe(false)
    expect(result.problems.some(p => p.startsWith('pairing changed'))).toBe(true)
  })

  test('a dropped count fails', () => {
    const result = checkFacts('성공 10건, 실패 2건이에요.', '성공 10건이에요.')
    expect(result.ok).toBe(false)
    expect(result.problems.some(p => p.startsWith('number lost'))).toBe(true)
  })

  test('a sign flip fails', () => {
    const result = checkFacts('매출이 -5% 줄었어요.', '매출이 5% 줄었어요.')
    expect(result.ok).toBe(false)
    expect(result.problems.some(p => p.startsWith('sign changed'))).toBe(true)
  })

  test('a Korean large-number unit change fails', () => {
    const result = checkFacts('가격은 10원이에요.', '가격은 10만원이에요.')
    expect(result.ok).toBe(false)
  })

  test('reordering that keeps each subject with its number passes', () => {
    expect(checkFacts('성공 10건, 실패 2건이에요.', '실패 2건, 성공 10건이에요.').ok).toBe(true)
  })

  test('thousands separators do not count as a change', () => {
    expect(checkFacts('4,243개 파일을 읽었어요.', '파일 4243개를 다 읽었어요.').ok).toBe(true)
  })

  test('a changed time fails', () => {
    expect(checkFacts('12:22 KST에 받았어요.', '12:32 KST에 받았어요.').ok).toBe(false)
  })

  test('a removed negation is a warning, not silence', () => {
    const result = checkFacts('설치는 하지 않았어요.', '설치는 했어요.')
    expect(result.warnings.some(w => w.startsWith('negation markers'))).toBe(true)
  })

  test('a removed possibility marker is a warning', () => {
    const result = checkFacts('내일 끝날 수 있어요.', '내일 끝나요.')
    expect(result.warnings.some(w => w.startsWith('possibility'))).toBe(true)
  })

  test('numbers carry their subject and unit', () => {
    const [first] = extractNumbers('실패 2건')
    expect(first).toMatchObject({ value: '2', unit: '건', subject: '실패' })
  })
})
