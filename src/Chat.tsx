import { type ConnectFormData } from "./ConnectForm";

interface ChatProps {
    formData: ConnectFormData;
}

export default function Chat({ formData }: ChatProps) {
    return (
        <div style={{ 
            position: "fixed", 
            bottom: 20, 
            right: 20, 
            padding: 16, 
            background: "white", 
            border: "1px solid #ddd", 
            borderRadius: 8,
            maxWidth: 300,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: 16 }}>Chat Component</h3>
            <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                <div><strong>API Key:</strong> {formData.apiKey || "(empty)"}</div>
                <div><strong>Call ID:</strong> {formData.callId}</div>
                <div><strong>User ID:</strong> {formData.userId}</div>
                <div><strong>Token:</strong> {formData.token ? "***" + formData.token.slice(-4) : "(empty)"}</div>
            </div>
        </div>
    );
}
