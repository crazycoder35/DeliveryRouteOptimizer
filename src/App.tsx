import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AddressInput from './components/AddressInput';
import AddressList from './components/AddressList';
import MapDisplay from './components/MapDisplay';
import Instructions from './components/Instructions';
import Footer from './components/Footer';
import Settings from './components/Settings';
import { calculateRoute, geocodeAddress } from './utils/routeUtils';
import { saveRoute, loadRoute, getSavedRoutes } from './utils/storageUtils';
import { Location, RouteInfo } from './types';

function App() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [savedRoutes, setSavedRoutes] = useState<string[]>([]);
  const [settings, setSettings] = useState({
    units: 'metric',
    mapStyle: 'default',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSavedRoutes(getSavedRoutes());
  }, []);

  const handleAddAddress = async (address: string) => {
    try {
      setError(null);
      const newLocation = await geocodeAddress(address);
      setLocations(prevLocations => [...prevLocations, newLocation]);
      if (locations.length > 0) {
        const newRouteInfo = await calculateRoute([...locations, newLocation], settings.units);
        setRouteInfo(newRouteInfo);
      }
    } catch (error) {
      console.error('Error adding address:', error);
      setError('Failed to add address. Please try a different one.');
    }
  };

  const handleRemoveAddress = (index: number) => {
    const newLocations = locations.filter((_, i) => i !== index);
    setLocations(newLocations);
    if (newLocations.length > 1) {
      calculateRoute(newLocations, settings.units).then(setRouteInfo);
    } else {
      setRouteInfo(null);
    }
  };

  const handleSaveRoute = (name: string) => {
    if (locations.length > 1) {
      saveRoute(name, locations);
      setSavedRoutes(getSavedRoutes());
    }
  };

  const handleLoadRoute = async (name: string) => {
    const loadedLocations = loadRoute(name);
    if (loadedLocations) {
      setLocations(loadedLocations);
      if (loadedLocations.length > 1) {
        const newRouteInfo = await calculateRoute(loadedLocations, settings.units);
        setRouteInfo(newRouteInfo);
      }
    }
  };

  const handleSettingsChange = (newSettings: typeof settings) => {
    setSettings(newSettings);
    if (locations.length > 1) {
      calculateRoute(locations, newSettings.units).then(setRouteInfo);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <AddressInput onAddAddress={handleAddAddress} />
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <AddressList locations={locations} onRemoveAddress={handleRemoveAddress} />
            <Settings
              settings={settings}
              onSettingsChange={handleSettingsChange}
              onSaveRoute={handleSaveRoute}
              onLoadRoute={handleLoadRoute}
              savedRoutes={savedRoutes}
            />
            <Instructions routeInfo={routeInfo} units={settings.units} />
          </div>
          <div className="h-[600px]">
            <MapDisplay locations={locations} routeInfo={routeInfo} mapStyle={settings.mapStyle} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;