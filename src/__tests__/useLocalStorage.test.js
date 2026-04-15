import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useLocalStorage } from '../hooks/useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('returns the initial value when the key does not exist', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    expect(result.current[0]).toBe('initial')
  })

  it('accepts a factory function as initial value', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', () => 'from-factory'))
    expect(result.current[0]).toBe('from-factory')
  })

  it('reads an existing value already in localStorage', () => {
    window.localStorage.setItem('test-key', JSON.stringify('pre-stored'))
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    expect(result.current[0]).toBe('pre-stored')
  })

  it('persists a new value to localStorage on setValue', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))

    act(() => result.current[1]('updated'))

    expect(result.current[0]).toBe('updated')
    expect(JSON.parse(window.localStorage.getItem('test-key'))).toBe('updated')
  })

  it('supports a function updater (similar to useState)', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0))

    act(() => result.current[1]((n) => n + 5))

    expect(result.current[0]).toBe(5)
  })

  it('removes the value and resets to initial on removeValue', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))

    act(() => result.current[1]('stored'))
    act(() => result.current[2]()) // removeValue

    expect(result.current[0]).toBe('initial')
    expect(window.localStorage.getItem('test-key')).toBeNull()
  })

  it('persists objects correctly', () => {
    const obj = { a: 1, b: [2, 3] }
    const { result } = renderHook(() => useLocalStorage('obj-key', null))

    act(() => result.current[1](obj))

    expect(result.current[0]).toEqual(obj)
  })
})
