import React from 'react';
import { Truck } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex items-center">
        <Truck className="w-8 h-8 mr-2" />
        <h1 className="text-2xl font-bold">Delivery Route Optimizer</h1>
      </div>
    </header>
  );
};

export default Header;