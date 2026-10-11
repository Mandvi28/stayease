import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ErrorState = ({ message = 'Something went wrong.', onRetry }) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-100 bg-red-50 py-16 px-6 text-center">
    <AlertTriangle size={28} className="text-red-400" />
    <p className="max-w-sm text-sm text-red-700">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="btn-secondary mt-2">
        Try again
      </button>
    )}
  </div>
);

export default ErrorState;
