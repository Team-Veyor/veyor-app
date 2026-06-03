interface CheckIconProps {
  className?: string;
}

const CheckIcon = ({ className }: CheckIconProps) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden='true'
      className={className}
    >
      <path
        d='M10.3667 16L6.56665 12.2L7.51665 11.25L10.3667 14.1L16.4833 7.98334L17.4333 8.93334L10.3667 16Z'
        fill='currentColor'
      />
    </svg>
  );
};

export default CheckIcon;
