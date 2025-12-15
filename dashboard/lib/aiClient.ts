export interface AIRiskResponse {
    riskScore: number;
    label: "LOW" | "MEDIUM" | "HIGH";
    timestamp: string;
    isAI?: boolean;
    isMock?: boolean;
}

const AI_SERVICE_URL = "http://localhost:4000";

export async function getRiskScore(address: string, txHistory: any[] = []): Promise<AIRiskResponse> {
    try {
        const res = await fetch(`${AI_SERVICE_URL}/risk-score`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address, txHistory }),
        });

        if (!res.ok) {
            throw new Error(`AI Service Error: ${res.statusText}`);
        }

        return await res.json();
    } catch (error) {
        console.error("Failed to fetch risk score:", error);
        // Fallback mock
        return {
            riskScore: 50,
            label: "MEDIUM",
            timestamp: new Date().toISOString(),
            isMock: true
        };
    }
}
