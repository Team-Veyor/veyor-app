import { type InputHTMLAttributes, useId, useRef } from 'react';
import CancelIcon from '@/assets/icons/CancelIcon';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** 입력 필드 위에 표시할 라벨 */
  label?: string;
  /** 입력 필드 아래에 표시할 보조 안내 문구 */
  helperText?: string;
  /** 에러 상태. 라벨·외곽선·보조 문구가 빨간색으로 강조됩니다. */
  error?: boolean;
}

/**
 * 공통 텍스트 입력 컴포넌트.
 * 표준 `<input>` 속성을 그대로 받으며, 포커스 시 외곽선이 강조됩니다.
 * 값이 있으면 우측에 입력값을 지우는 버튼이 표시됩니다.
 * `label`/`helperText`/`error`로 라벨·보조 문구·에러 상태를 함께 표현할 수 있습니다.
 */
const Input = ({
  type = 'text',
  placeholder,
  className,
  value,
  label,
  helperText,
  error,
  id,
  disabled,
  onChange,
  ...props
}: InputProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);

  const hasValue = value !== undefined && value !== null && value !== '';
  const showClear = hasValue && !disabled;

  const handleClear = () => {
    const input = inputRef.current;
    if (!input) return;

    const nativeSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value',
    )?.set;
    nativeSetter?.call(input, '');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.focus();
  };

  const wrapperClasses =
    'flex w-full items-center gap-12 rounded-[16px] bg-gray-50 p-[16px] border border-transparent transition-colors focus-within:border-gray-900';
  const inputClasses =
    'body-large-strong w-full bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:text-gray-500 disabled:placeholder:text-gray-500 disabled:opacity-60';

  return (
    <div className='flex w-full flex-col gap-8'>
      {label && (
        <label
          htmlFor={inputId}
          className={cn('label-medium', error ? 'text-red-500' : 'text-gray-900')}
        >
          {label}
        </label>
      )}

      <div
        className={cn(
          wrapperClasses,
          error && 'border-red-500 focus-within:border-red-500',
          className,
        )}
      >
        <input
          ref={inputRef}
          id={inputId}
          type={type}
          placeholder={placeholder}
          aria-invalid={error || undefined}
          className={inputClasses}
          value={value}
          disabled={disabled}
          onChange={onChange}
          {...props}
        />
        {showClear && (
          <button
            type='button'
            onClick={handleClear}
            aria-label='입력값 지우기'
            className='shrink-0 text-gray-500 cursor-pointer'
          >
            <CancelIcon />
          </button>
        )}
      </div>

      {helperText && (
        <p
          className={cn('label-small-weak', error ? 'text-text-danger-weak' : 'text-text-tertiary')}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
