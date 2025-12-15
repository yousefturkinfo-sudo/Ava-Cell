import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// --- Mock AI Logic ---

const getRandomScore = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const { GoogleGenerativeAI } = require("@google/generative-ai");

// POST /risk-score
// Input: { address: string, txHistory: any[] }
// Output: { riskScore: number (0-100), label: string }
app.post("/risk-score", async (req, res) => {
    const { address, txHistory } = req.body;
    console.log(`Analyzing risk for address: ${address}`);

    if (process.env.GOOGLE_API_KEY) {
        try {
            const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const prompt = `Analyze the risk of this crypto address: ${address}. 
            Transaction History Summary: ${JSON.stringify(txHistory || []).slice(0, 500)}. 
            Return JSON with keys: riskScore (0-100), label (LOW/MEDIUM/HIGH).`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const data = JSON.parse(jsonMatch[0]);
                // Ensure riskScore and label are present, fallback if needed
                return res.json({
                    riskScore: data.riskScore || 50,
                    label: data.label || "MEDIUM",
                    timestamp: new Date().toISOString(),
                    isAI: true
                });
            }
        } catch (error) {
            console.error("AI Error:", error);
        }
    }

    // Mock Logic Fallback
    let score = getRandomScore(10, 80);

    if (address && address.toLowerCase().startsWith("0x000")) {
        score += 20;
    }

    const label = score < 30 ? "LOW" : score < 70 ? "MEDIUM" : "HIGH";

    res.json({
        riskScore: score,
        label,
        timestamp: new Date().toISOString(),
        isMock: true
    });
});

// POST /anomaly-detect
// Input: { txBatch: any[] }
// Output: { anomalies: any[] }
app.post("/anomaly-detect", (req, res) => {
    const { txBatch } = req.body;

    if (!Array.isArray(txBatch)) {
        return res.status(400).json({ error: "txBatch must be an array" });
    }

    // Detect mock anomalies: values > 1000 are "anomalous"
    const anomalies = txBatch.filter((tx: any) => tx.value > 1000);

    res.json({
        anomalies,
        count: anomalies.length
    });
});

// POST /graph-insights
// Input: { addressGraph: any[] }
app.post("/graph-insights", (req, res) => {
    // Mock response
    res.json({
        centralityScore: 0.85,
        suspiciousLinks: 2,
        clusterId: "Cluster-A"
    });
});

app.listen(PORT, () => {
    console.log(`🤖 AI Microservice running on http://localhost:${PORT}`);
});
