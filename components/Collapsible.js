import { useState } from 'react';

export function Collapsible({ children }) {
  return <div>{children}</div>;
}

export function CollapsibleTrigger({ children, onClick }) {
  return (
    <button onClick={onClick} className="text-blue-600 underline text-sm">
      {children}
    </button>
  );
}

export function CollapsibleContent({ isOpen, children, className = '' }) {
  return isOpen ? <div className={className}>{children}</div> : null;
}
