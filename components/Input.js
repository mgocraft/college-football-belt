// components/Input.js
import React from 'react';

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`border rounded px-3 py-1 w-full ${className}`}
      {...props}
    />
  );
}
