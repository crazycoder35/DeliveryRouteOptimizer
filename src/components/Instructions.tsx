import React from 'react';
import { RouteInfo } from '../types';
import { formatDistance, formatDuration } from '../utils/formatUtils';

interface InstructionsProps {
  routeInfo: RouteInfo | null;
  units: string;
}

const Instructions: React.FC<InstructionsProps> = ({ routeInfo, units }) => {
  if (!routeInfo) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md mt-4">
        <h2 className="text-xl font-semibold mb-4">Route Summary</h2>
        <p className="text-gray-500">Add at least two locations to see route information.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4">
      <h2 className="text-xl font-semibold mb-4">Route Summary</h2>
      <div className="flex justify-between items-center">
        <div className="text-center">
          <p className="text-sm text-gray-500">Total Distance</p>
          <p className="text-lg font-bold">{formatDistance(routeInfo.totalDistance, units)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Estimated Time</p>
          <p className="text-lg font-bold">{formatDuration(routeInfo.totalDuration)}</p>
        </div>
      </div>
    </div>
  );
};

export default Instructions;