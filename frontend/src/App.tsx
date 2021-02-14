import React from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

export const App: React.FC = () => {
  return (
    <div className="container">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <p>HELLO</p>
      </ErrorBoundary>
    </div>
  );
};

function ErrorFallback({ error }: FallbackProps) {
  return (
    <div className="error-fallback-wrapper">
      <div className="error-fallback" role="alert">
        <p>Something went wrong:</p>
        <p>{error.message}</p>
        <p>Please refresh the page and try again.</p>
      </div>
    </div>
  );
}
