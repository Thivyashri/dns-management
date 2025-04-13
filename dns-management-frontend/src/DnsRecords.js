import React, { useState } from 'react';
import axios from 'axios';

const DnsRecords = () => {
  const [domain, setDomain] = useState('');
  const [dnsRecords, setDnsRecords] = useState(null);
  const [error, setError] = useState('');

  const fetchDnsRecords = async () => {
    setError('');
    setDnsRecords(null);
    if (!domain) {
      setError('Please enter a domain name');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5050/api/dns-records?domain=${domain}`);
      setDnsRecords(response.data.records);
    } catch (err) {
      setError('Error fetching DNS records');
    }
  };

  return (
    <div>
      <h1>DNS Records</h1>
      <input
        type="text"
        placeholder="Enter domain"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
      />
      <button onClick={fetchDnsRecords}>Fetch DNS Records</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {dnsRecords && (
        <div>
          <h2>Records for {domain}</h2>
          <pre>{JSON.stringify(dnsRecords, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default DnsRecords;
