import React from 'react';

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-pine-200 bg-white/60 py-16 px-6 text-center">
    {Icon && <Icon size={32} className="text-pine-300" />}
    <h3 className="font-display text-lg text-pine-800">{title}</h3>
    {description && <p className="max-w-sm text-sm text-pine-400">{description}</p>}
    {action}
  </div>
);

export default EmptyState;
