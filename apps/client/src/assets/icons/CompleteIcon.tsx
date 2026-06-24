interface CompleteIconProps {
  className?: string;
}

const CompleteIcon = ({ className }: CompleteIconProps) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='86'
      height='86'
      viewBox='0 0 86 86'
      fill='none'
      aria-hidden='true'
      className={className}
    >
      <g filter='url(#filter0_i_609_3841)'>
        <rect width='86' height='86' rx='43' fill='#09BA8E' fill-opacity='0.15' />
        <path
          d='M39.314 55.3369L27.6426 43.6655L30.5604 40.7476L39.314 49.5012L58.1009 30.7143L61.0188 33.6321L39.314 55.3369Z'
          fill='#09BA8E'
        />
      </g>
      <defs>
        <filter
          id='filter0_i_609_3841'
          x='0'
          y='0'
          width='86'
          height='86'
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood floodOpacity='0' result='BackgroundImageFix' />
          <feBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
          <feColorMatrix
            in='SourceAlpha'
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
            result='hardAlpha'
          />
          <feOffset />
          <feGaussianBlur stdDeviation='15.3571' />
          <feComposite in2='hardAlpha' operator='arithmetic' k2='-1' k3='1' />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0.788235 0 0 0 0 0.352941 0 0 0 0.1 0'
          />
          <feBlend mode='normal' in2='shape' result='effect1_innerShadow_609_3841' />
        </filter>
      </defs>
    </svg>
  );
};

export default CompleteIcon;
