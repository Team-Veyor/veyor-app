interface HomeIconProps {
  className?: string;
}

const HomeIcon = ({ className }: HomeIconProps) => {
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
      <path d='M4 21V9L12 3L20 9V21H14V14H10V21H4Z' fill='currentColor' />
    </svg>
  );
};

export default HomeIcon;
