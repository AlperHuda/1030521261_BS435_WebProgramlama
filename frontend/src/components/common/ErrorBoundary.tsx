import React from 'react';
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary';

interface Props {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Something went wrong.</h2>
            <p>We're sorry, but an unexpected error occurred.</p>
            {error && (
                <details style={{ whiteSpace: 'pre-wrap', margin: '10px 0', color: 'red' }}>
                    {error.message}
                </details>
            )}
            <button onClick={() => window.location.reload()} className="button" style={{ marginTop: '10px' }}>
                Reload Page
            </button>
        </div>
    );
};

const ErrorBoundary: React.FC<Props> = ({ children, fallback }) => {
    return (
        <ReactErrorBoundary
            FallbackComponent={fallback ? () => <>{fallback}</> : ErrorFallback}
            onReset={() => {
                // reset the state of your app so the error doesn't happen again
            }}
        >
            {children}
        </ReactErrorBoundary>
    );
};

export default ErrorBoundary;
