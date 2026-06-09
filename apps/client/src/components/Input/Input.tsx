import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** 입력 필드를 감싸는 외곽 `<div>`에 적용할 Tailwind 클래스 */
  wrapperClassName?: string;
}

/**
 * 공통 텍스트 입력 컴포넌트.
 * 표준 `<input>` 속성을 그대로 받으며, 포커스 시 외곽선이 강조됩니다.
 */
const Input = ({
  type = 'text',
  placeholder,
  className,
  value,
  wrapperClassName,
  ...props
}: InputProps) => {
  const wrapperClasses =
    'w-full rounded-[16px] bg-gray-50 p-[16px] shadow-[inset_0_0_0_1px_var(--color-gray-200)] transition-shadow focus-within:shadow-[inset_0_0_0_1px_var(--color-gray-800)]';
  const inputClasses =
    'body-large-strong w-full bg-transparent text-gray-900 placeholder:text-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:text-gray-400 disabled:placeholder:text-gray-400';

  return (
    <div className={cn(wrapperClasses, wrapperClassName)}>
      <input
        type={type}
        placeholder={placeholder}
        className={cn(inputClasses, className)}
        value={value}
        {...props}
      />
    </div>
  );
};

export default Input;
