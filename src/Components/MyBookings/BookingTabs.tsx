import React from 'react';
import DropDown from '../Inputs/DropDown';

const tabs = [
  'All bookings',
  'Reserved',
  'Service started',
  'Service provided',
  'Booking finished',
  'Cancelled',
];

interface Props {
  selected: string;
  onChange: (tab: string) => void;
}

const BookingTabs: React.FC<Props> = ({ selected, onChange }) => {
  return (
    <div className="mb-6 w-full">
      {/* Tabs for desktop */}
      <div className="hidden md:flex space-x-4 text-sm font-medium px-4 pl-0">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`pb-1 ${selected === tab
              ? 'text-black'
              : 'text-gray-500 border-transparent'
              } transition-all duration-150`}
            onClick={() => onChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="block md:hidden px-4 relative">
        <DropDown
          label=""
          options={tabs.map(tab => ({
            value: tab,
            label: tab,
          }))}
          placeholder={
            selected || "Select a location"
          }
          onchange={value => onChange(value[0])}
        />
      </div>

    </div>
  );
};

export default BookingTabs;
