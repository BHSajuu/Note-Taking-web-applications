import React, { useEffect, useRef, useState } from 'react';
import type { OTPInputProps } from '../types';


const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value = '',
  onChange,
  onComplete,
  autoFocus = true,
}) => {
  const [digits, setDigits] = useState<string[]>(
    Array.from({ length }, (_, i) => value[i] ?? '')
  );
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    // keep local state in sync if parent passes a value
    if (value && value !== digits.join('')) {
      const newDigits = Array.from({ length }, (_, i) => value[i] ?? '');
      setDigits(newDigits);
    }
  }, [value]);

  useEffect(() => {
    const joined = digits.join('');
    onChange?.(joined);
    if (joined.length === length && !joined.includes('')) {
      onComplete?.(joined);
    }
  }, [digits]);

  const focusInput = (idx: number) => {
    const el = inputsRef.current[idx];
    el?.focus();
    el?.select();
  };

  const handleChange = (idx: number, raw: string) => {
    const onlyDigits = raw.replace(/\D/g, '');
    if (!onlyDigits) {
      setDigits((prev) => {
        const next = [...prev];
        next[idx] = '';
        return next;
      });
      return;
    }

    // If user pasted multiple digits or typed quickly
    const chars = onlyDigits.split('');
    setDigits((prev) => {
      const next = [...prev];
      let writeIndex = idx;
      for (let c of chars) {
        if (writeIndex >= length) break;
        next[writeIndex] = c;
        writeIndex++;
      }
      return next;
    });

    // focus next empty after a tiny delay to ensure state updated
    setTimeout(() => {
      const nextIndex = Math.min(idx + chars.length, length - 1);
      for (let i = nextIndex; i < length; i++) {
        if (inputsRef.current[i] && inputsRef.current[i]!.value === '') {
          focusInput(i);
          return;
        }
      }
      focusInput(Math.min(idx + chars.length, length - 1));
    }, 0);
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;
    if (key === 'Backspace') {
      e.preventDefault();
      setDigits((prev) => {
        const next = [...prev];
        if (next[idx]) {
          next[idx] = '';
          return next;
        }
        if (idx > 0) {
          next[idx - 1] = '';
        }
        return next;
      });
      setTimeout(() => {
        if (idx > 0) focusInput(idx - 1);
      }, 0);
    } else if (key === 'ArrowLeft' && idx > 0) {
      e.preventDefault();
      focusInput(idx - 1);
    } else if (key === 'ArrowRight' && idx < length - 1) {
      e.preventDefault();
      focusInput(idx + 1);
    }
  };

  const handlePaste = (idx: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('Text').replace(/\D/g, '');
    if (!paste) return;
    const chars = paste.slice(0, length - idx).split('');
    setDigits((prev) => {
      const next = [...prev];
      let write = idx;
      for (let c of chars) {
        next[write] = c;
        write++;
        if (write >= length) break;
      }
      return next;
    });
    setTimeout(() => {
      const finalIdx = Math.min(idx + chars.length, length - 1);
      focusInput(finalIdx);
    }, 0);
  };

  return (
    <div className="flex gap-2">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          aria-label={`OTP digit ${i + 1}`}
          value={digits[i] ?? ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={(e) => handlePaste(i, e)}
          className="w-12 h-12 flex items-center justify-center text-center px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          onFocus={(e) => e.currentTarget.select()}
          autoFocus={autoFocus && i === 0}
        />
      ))}
    </div>
  );
};

export default OTPInput;
