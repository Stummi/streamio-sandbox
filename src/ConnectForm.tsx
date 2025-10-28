import { useState } from "react";

export interface ConnectFormData {
    apiKey: string;
    callId: string;
    userId: string;
    token: string;
}

interface ConnectFormProps {
    onConnect: (formData: ConnectFormData) => void;
    isConnecting: boolean;
    error: string | null;
}

export default function ConnectForm({ onConnect, isConnecting, error }: ConnectFormProps) {
    const [apiKey, setApiKey] = useState("");
    const [callId, setCallId] = useState("foobar");
    const [userId, setUserId] = useState("user_id");
    const [token, setToken] = useState("");

    const handleSubmit = () => {
        onConnect({ apiKey, callId, userId, token });
    };

    return (
        <div className="connect-container" style={{ maxWidth: 520, margin: "3rem auto", padding: 24, border: "1px solid #e5e5e5", borderRadius: 12 }}>
            <h2 style={{ marginTop: 0 }}>Join a Livestream Call</h2>

            <label style={{ display: "block", marginBottom: 8 }}>
                <div style={{ fontSize: 12, opacity: 0.9, marginBottom: 6 }}>apiKey</div>
                <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Your Stream API Key"
                    style={{ width: "100%", padding: 10 }}
                />
            </label>

            <label style={{ display: "block", marginBottom: 8 }}>
                <div style={{ fontSize: 12, opacity: 0.9, marginBottom: 6 }}>callId</div>
                <input
                    type="text"
                    value={callId}
                    onChange={(e) => setCallId(e.target.value)}
                    placeholder="e.g. foobar"
                    style={{ width: "100%", padding: 10 }}
                />
            </label>

            <label style={{ display: "block", marginBottom: 8 }}>
                <div style={{ fontSize: 12, opacity: 0.9, marginBottom: 6 }}>user_id</div>
                <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Your user id"
                    style={{ width: "100%", padding: 10 }}
                />
            </label>

            <label style={{ display: "block", marginBottom: 8 }}>
                <div style={{ fontSize: 12, opacity: 0.9, marginBottom: 6 }}>token</div>
                <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Dev/Server token for this user"
                    style={{ width: "100%", padding: 10 }}
                />
            </label>

            {error && (
                <div style={{ color: "#b00020", marginTop: 8, marginBottom: 8 }}>
                    {error}
                </div>
            )}

            <button
                onClick={handleSubmit}
                disabled={isConnecting}
                style={{
                    padding: "10px 16px",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                    background: "#005fff",
                    color: "white",
                    width: "100%",
                    fontWeight: 600,
                    opacity: isConnecting ? 0.7 : 1,
                }}
            >
                {isConnecting ? "Connecting..." : "Connect"}
            </button>
        </div>
    );
}
