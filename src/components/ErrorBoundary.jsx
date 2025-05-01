import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    // Try to recover by reloading the page
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white p-4">
          <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-red-400">
              Oops! Something went wrong
            </h2>
            <div className="space-y-4">
              <p className="text-gray-300">
                The game encountered an unexpected error. You can try:
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>Refreshing the page</li>
                <li>Clearing your browser cache</li>
                <li>Starting a new game</li>
              </ul>
              
              {/* Show error details in development */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-4 bg-gray-900 rounded-lg overflow-auto">
                  <p className="text-sm font-mono text-red-400 mb-2">
                    {this.state.error?.toString()}
                  </p>
                  <pre className="text-xs font-mono text-gray-400 max-h-32 overflow-auto whitespace-pre-wrap">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              )}

              <div className="mt-6 space-x-4">
                <button
                  onClick={this.handleRetry}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 
                           text-white rounded-lg font-medium transition-colors
                           focus:outline-none focus:ring-2 focus:ring-blue-500 
                           focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  Retry Game
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;