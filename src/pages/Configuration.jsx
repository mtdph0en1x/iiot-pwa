import React from 'react';
import { Shield } from 'lucide-react';

export default function Configuration() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">About this solution</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-500">Version</label>
          <p className="mt-1 text-lg font-semibold">1.4.2</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500">Client's Company Name</label>
          <p className="mt-1 text-lg font-semibold">Ruslan Holub Solutions</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500">Worker's ID</label>
          <p className="mt-1 text-lg font-semibold">WID-228-1337</p>
        </div>

        <div className="pt-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-start">
              <Shield className="text-red-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-medium text-red-800">Emergency Line</h3>
                <p className="text-sm text-red-700">+1 (322) 420-6767</p>
                <p className="text-xs text-red-600 mt-1">Available 24/7 for critical issues</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
