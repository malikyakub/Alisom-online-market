import React from 'react';

interface InformationCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  value?: string;
  label?: string;
  iconBgColor?: string;
  textColor?: string;
}

const InformationCard: React.FC<InformationCardProps> = ({ 
  icon: Icon, 
  value = '0', 
  label = 'Label goes here', 
  iconBgColor = '#1A2238', 
  textColor = '#1A2238' 
}) => {
  return (
    <div className='bg-white w-[270px] h-[230px] rounded-lg shadow-md flex flex-col justify-center items-center'>
      <div className='w-20 h-20 rounded-full flex justify-center items-center mb-2' style={{ backgroundColor: iconBgColor }}>
        <Icon className='text-white text-2xl' />
      </div>
      <h2 className='text-2xl font-bold'>{value}</h2>
      <p className='text-sm mt-1 font-bold' style={{ color: textColor }}>{label}</p>
    </div>
  );
}

export default InformationCard;
