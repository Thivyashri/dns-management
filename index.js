const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5050;

app.use(cors());

// Test root route
app.get('/', (req, res) => {
  res.send('DNS Management API is working!');
});

// DNS record types to query
const dnsTypes = ['A', 'AAAA', 'MX', 'NS', 'CNAME', 'TXT', 'SOA', 'SRV', 'CAA'];

// Endpoint to fetch DNS records for a domain
app.get('/api/dns-records', async (req, res) => {
  const domain = req.query.domain;
  console.log(`🔍 Incoming request for domain: ${domain}`);  // Debugging log

  if (!domain) return res.status(400).json({ error: 'Domain is required' });

  const records = {};

  try {
    await Promise.all(
      dnsTypes.map(async (type) => {
        const response = await axios.get(`https://dns.google/resolve?name=${domain}&type=${type}`);
        if (response.data.Answer) {
          records[type] = response.data.Answer.map((r) => r.data);
        } else {
          records[type] = [];
        }
      })
    );

    res.json({ domain, records });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`DNS Management API running on http://localhost:${PORT}`);
});
