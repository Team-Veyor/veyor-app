import ChevronLeftIcon from '@/assets/icons/ChevronLeftIcon';

const Header = () => {
  return (
    <header className='flex items-center justify-between h-[44px]'>
      <button type='button' className='py-2.5 pl-[6px] pr-[14px]'>
        <ChevronLeftIcon />
      </button>
    </header>
  );
};

export default Header;
