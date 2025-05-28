import React, { useState } from 'react';

const fields = {
  score: '',
  company: '',
  appName: '',
  environment: '',
  baseUrl: '',
  isLoginRequired: '',
  protectedRoute: '',
  loginMethod: '',
  sessionType: '',
  haveStackhawkYml: '',
  loggedInIndicator: '',
  loggedOutIndicator: '',
  languages: '',
  frontendFramework: '',
  backendFramework: '',
  databases: '',
  authProvider: '',
  apiStyle: '',
  openApiAvailable: '',
  openApiPath: '',
  ciCdProvider: '',
  scanMethod: '',
  secretsInjection: '',
  sessionAuthMethod: '',
  authTokenNames: '',
  authScriptUsed: '',
  scriptProvided: '',
  testCredentialsAvailable: '',
  loginWorks: '',
  protectedRouteAccessible: '',
  repoAccess: '',
  whatsNext: '',
  canCloneRepo: '',
  secretsProvided: '',
  appReachable: '',
  vpnNeeded: '',
  loginFlowConfirmed: '',
  scriptOutputJsonReady: ''
};

export default function Form({ onSubmit }) {
  const [form, setForm] = useState(fields);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {Object.keys(fields).map((key) => (
        <div key={key} className="flex flex-col">
          <label className="font-medium capitalize">{key}</label>
          <input
            className="border p-2 rounded"
            name={key}
            value={form[key]}
            onChange={handleChange}
          />
        </div>
      ))}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Generate YAML
      </button>
    </form>
  );
}
