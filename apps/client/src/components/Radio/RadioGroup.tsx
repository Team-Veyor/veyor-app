import { Children, cloneElement, type HTMLAttributes, isValidElement, type ReactNode } from 'react';
import RadioButton, { type RadioButtonProps } from '@/components/Radio/RadioButton';
import { cn } from '@/lib/utils';

interface RadioGroupProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  children: ReactNode;
}

const RadioGroup = ({ name, children, className, ...props }: RadioGroupProps) => {
  const radioButtons = Children.map(children, (child) => {
    if (!isValidElement<RadioButtonProps>(child) || child.type !== RadioButton) {
      return child;
    }

    return cloneElement(child, { name });
  });

  return (
    <div role='radiogroup' className={cn('flex flex-col gap-3', className)} {...props}>
      <div className='flex flex-col gap-5'>{radioButtons}</div>
    </div>
  );
};

export default RadioGroup;
