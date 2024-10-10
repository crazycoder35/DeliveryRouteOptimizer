import React, { useState, useEffect, useRef } from 'react';
import { Plus, Loader } from 'lucide-react';
import axios from 'axios';

interface AddressInputProps {
  onAddAddress: (address: string) => void;
}

interface Suggestion {
  place_id: number;
  display_name: string;
}

const AddressInput: React.FC<AddressInputProps> = ({ onAddAddress }) => {
  const [newAddress, setNewAddress] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (newAddress.length < 3) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
          params: {
            q: newAddress,
            format: 'json',
            addressdetails: 1,
            limit: 5,
          },
        });

        setSuggestions(response.data);
      } catch (err) {
        setError('Failed to fetch address suggestions. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);

    return () => clearTimeout(debounceTimer);
  }, [newAddress]);

  const handleAddAddress = () => {
    if (newAddress.trim()) {
      onAddAddress(newAddress.trim());
      setNewAddress('');
      setSuggestions([]);
      setError(null);
    } else {
      setError('Please enter a valid address.');
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setNewAddress(suggestion.display_name);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-semibold mb-4">Add Delivery Addresses</h2>
      <div className="relative">
        <div className="flex mb-2">
          <input
            ref={inputRef}
            type="text"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder="Enter address"
            className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddAddress}
            className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? <Loader className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.place_id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AddressInput;