import { useState, useEffect, useCallback } from 'react'

/**
 * Persists state to localStorage with JSON serialization.
 * Handles SSR, JSON errors, and storage events across tabs.
 *
 * @template T
 * @param {string} key - localStorage key
 * @param {T | (() => T)} initialValue - value or factory fn
 * @returns {[T, (value: T | ((prev: T) => T)) => void, () => void]}
 *   [storedValue, setValue, removeValue]
 */
export function useLocalStorage(key, initialValue) {
  const readValue = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item !== null) {
        return JSON.parse(item)
      }
    } catch (error) {
      console.warn(`[useLocalStorage] Error reading key "${key}":`, error)
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps

  const [storedValue, setStoredValue] = useState(readValue)

  const setValue = useCallback(
    (value) => {
      try {
        const newValue =
          typeof value === 'function' ? value(storedValue) : value
        window.localStorage.setItem(key, JSON.stringify(newValue))
        setStoredValue(newValue)
        // Notify other hooks listening to the same key in this tab
        window.dispatchEvent(new CustomEvent('local-storage', { detail: { key } }))
      } catch (error) {
        console.warn(`[useLocalStorage] Error setting key "${key}":`, error)
      }
    },
    [key, storedValue],
  )

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(typeof initialValue === 'function' ? initialValue() : initialValue)
      window.dispatchEvent(new CustomEvent('local-storage', { detail: { key } }))
    } catch (error) {
      console.warn(`[useLocalStorage] Error removing key "${key}":`, error)
    }
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync across tabs via native StorageEvent
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === key) {
        setStoredValue(readValue())
      }
    }
    // Native cross-tab event
    window.addEventListener('storage', handleStorageChange)
    // Same-tab custom event
    const handleCustom = (event) => {
      if (event.detail?.key === key) {
        setStoredValue(readValue())
      }
    }
    window.addEventListener('local-storage', handleCustom)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('local-storage', handleCustom)
    }
  }, [key, readValue])

  return [storedValue, setValue, removeValue]
}
