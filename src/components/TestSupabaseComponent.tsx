import React, { useState } from 'react';
import { runAllTests } from '../utils/testSupabaseConnection';

// Temporary component to test Supabase integration
// You can add this to your App.tsx temporarily to test the connection

const TestSupabaseComponent: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<string>('');

  const handleTest = async () => {
    setTesting(true);
    setResults('Running tests...\n');
    
    // Capture console output
    const originalLog = console.log;
    const originalError = console.error;
    let output = '';
    
    console.log = (...args) => {
      output += args.join(' ') + '\n';
      originalLog(...args);
    };
    
    console.error = (...args) => {
      output += 'ERROR: ' + args.join(' ') + '\n';
      originalError(...args);
    };
    
    try {
      await runAllTests();
    } catch (error) {
      output += `UNEXPECTED ERROR: ${error}\n`;
    }
    
    // Restore console
    console.log = originalLog;
    console.error = originalError;
    
    setResults(output);
    setTesting(false);
  };

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-md z-50">
      <h3 className="text-lg font-semibold mb-3">Supabase Test</h3>
      
      <button
        onClick={handleTest}
        disabled={testing}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 mb-3"
      >
        {testing ? 'Testing...' : 'Test Supabase Connection'}
      </button>
      
      {results && (
        <div className="bg-gray-100 p-3 rounded text-sm font-mono whitespace-pre-wrap max-h-64 overflow-y-auto">
          {results}
        </div>
      )}
      
      <div className="mt-3 text-xs text-gray-600">
        <p>This component helps test your Supabase setup.</p>
        <p>Remove it once everything is working!</p>
      </div>
    </div>
  );
};

export default TestSupabaseComponent;