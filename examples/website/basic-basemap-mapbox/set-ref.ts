import type {ForwardedRef} from 'react';

// Helper for covering all of the typescript cases for setting a ref
export function setRef<T>(ref: ForwardedRef<T>, value: T) {
  if (!ref) return;
  if (typeof ref === 'function') {
    ref(value);
  } else {
    ref.current = value;
  }
}
