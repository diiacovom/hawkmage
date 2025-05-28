import React, { useState } from 'react';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import Form from './components/Form';
import { generateYaml } from './utils/api';

Amplify.configure(awsconfig);

export default function App() {
  const [yaml, setYaml] = useState('');

  const handleSubmit = async (data) => {
    const result = await generateYaml(data);
    setYaml(result);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Hawkmage</h1>
      <Form onSubmit={handleSubmit} />
      {yaml && (
        <div className="mt-4">
          <h2 className="font-semibold mb-2">Generated YAML</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
            <code>{yaml}</code>
          </pre>
          <a
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(yaml)}`}
            download="stackhawk.yml"
            className="mt-2 inline-block bg-green-500 text-white px-4 py-2 rounded"
          >
            Download YAML
          </a>
        </div>
      )}
    </div>
  );
}
