import React from 'react';

export default function UserProfile() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-500">Name</label>
          <p className="mt-1 text-lg font-semibold">Admin User</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">Email</label>
          <p className="mt-1 text-lg font-semibold">admin@example.com</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">Role</label>
          <p className="mt-1 text-lg font-semibold">Administrator</p>
        </div>
      </div>
    </div>
  );
}
