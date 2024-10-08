import { ComponentProps, forwardRef, HTMLProps } from 'react';

import cn from '@/libs/cn';

export type InputProps = ComponentProps<'input'>;
const Input = forwardRef<HTMLInputElement, HTMLProps<HTMLInputElement>>(
  (props, ref) => {
    const { className, type = 'text', ...others } = props;
    const inputBaseStyle =
      'block h-14 rounded-lg border-[0.0625rem] border-solid border-brown p-4 placeholder:text-brown3 focus:outline-none focus:ring-1 focus:ring-point focus:border-point ring-subColor2 bg-transparent';
    return (
      <input
        type={type}
        className={cn(inputBaseStyle, className)}
        ref={ref}
        {...others}
      />
    );
  },
);
Input.displayName = 'Input';

export default Input;
