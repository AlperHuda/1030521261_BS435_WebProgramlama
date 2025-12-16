import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <h2>Something went wrong.</h2>
                    <p>We're sorry, but an unexpected error occurred.</p>
                    {this.state.error && (
                        <details style={{ whiteSpace: 'pre-wrap', margin: '10px 0', color: 'red' }}>
                            {this.state.error.toString()}
                        </details>
                    )}
                    <button onClick={() => window.location.reload()} className="button" style={{ marginTop: '10px' }}>
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
