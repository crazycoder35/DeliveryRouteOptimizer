import React from 'react';
import { Location } from '../types';
import { Trash2 } from 'lucide-react';

interface AddressListProps {
  locations: Location[];
  onRemoveAddress: (index: number) => void;
}

const AddressList: React.FC<AddressListProps> = ({ locations, onRemoveAddress }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4">
      <h2 className="text-xl font-semibold mb-4">Added Addresses</h2>
      {locations.length === 0 ? (
        <p className="text-gray-500">No addresses added yet.</p>
      ) : (
        <ul className="space-y-2">
          {locations.map((location, index) => (
            <li key={index} className="flex items-center justify-between">
              <span className="truncate">{location.address}</span>
              <button
                onClick={() => onRemoveAddress(index)}
                className="text-red-500 hover:text-red-700"
                aria-label="Remove address"
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressList;