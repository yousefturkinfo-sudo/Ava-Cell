# AI Risk Scoring Service

Node.js microservice providing mock AI risk analysis for Ava//Cell.

## Endpoints

- `POST /risk-score`: Get risk score (0-100) for an address.
- `POST /anomaly-detect`: Find anomalies in a batch of transactions.
- `POST /graph-insights`: Get graph centrality metrics.

## Running

1. **Install**:
   ```bash
   npm install
   ```

2. **Run**:
   ```bash
   npm run dev
   ```
   Service starts on port 4000.
