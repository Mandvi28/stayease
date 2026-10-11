import React from 'react';

const Loader = ({ label = 'Loading…' }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-pine-400">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-pine-200 border-t-pine-700" />
    <p className="text-sm">{label}</p>
  </div>
);

export default Loader;
