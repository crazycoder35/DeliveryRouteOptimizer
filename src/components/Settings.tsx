import React, { useState } from 'react';

interface SettingsProps {
  settings: {
    units: string;
    mapStyle: string;
  };
  onSettingsChange: (newSettings: { units: string; mapStyle: string }) => void;
  onSaveRoute: (name: string) => void;
  onLoadRoute: (name: string) => void;
  savedRoutes: string[];
}

const Settings: React.FC<SettingsProps> = ({
  settings,
  onSettingsChange,
  onSaveRoute,
  onLoadRoute,
  savedRoutes,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [routeName, setRouteName] = useState('');

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSettingsChange({ ...settings, units: e.target.value });
  };

  const handleMapStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSettingsChange({ ...settings, mapStyle: e.target.value });
  };

  const handleSaveRoute = () => {
    if (routeName.trim()) {
      onSaveRoute(routeName.trim());
      setRouteName('');
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left font-semibold text-lg mb-2 focus:outline-none"
      >
        Settings and Saved Routes {isOpen ? '▲' : '▼'}
      </button>
      {isOpen && (
        <div className="mt-4">
          <div className="mb-4">
            <label className="block mb-2">Units:</label>
            <select
              value={settings.units}
              onChange={handleUnitChange}
              className="w-full p-2 border rounded"
            >
              <option value="metric">Metric (km)</option>
              <option value="imperial">Imperial (miles)</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Map Style:</label>
            <select
              value={settings.mapStyle}
              onChange={handleMapStyleChange}
              className="w-full p-2 border rounded"
            >
              <option value="default">Default</option>
              <option value="satellite">Satellite</option>
              <option value="terrain">Terrain</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Save Current Route:</label>
            <div className="flex">
              <input
                type="text"
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
                placeholder="Enter route name"
                className="flex-grow p-2 border rounded-l"
              />
              <button
                onClick={handleSaveRoute}
                className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
          <div>
            <label className="block mb-2">Load Saved Route:</label>
            <select
              onChange={(e) => onLoadRoute(e.target.value)}
              className="w-full p-2 border rounded"
              defaultValue=""
            >
              <option value="" disabled>Select a route</option>
              {savedRoutes.map((route) => (
                <option key={route} value={route}>
                  {route}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;