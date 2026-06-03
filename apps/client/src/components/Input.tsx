import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
}

const Input = ({
  type = 'text',
  placeholder,
  className,
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
        {...props}
      />
    </div>
  );
};

export default Input;
