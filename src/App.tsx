import { useCallback, useEffect, useState } from "react";
import {
    Call,
    CallControls,
    SpeakerLayout,
    StreamCall,
    StreamTheme,
    StreamVideo,
    StreamVideoClient,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "./styles.css";

export default function App() {
    // Form fields
    const [apiKey, setApiKey] = useState("");
    const [callId, setCallId] = useState("foobar");
    const [userId, setUserId] = useState("user_id");
    const [token, setToken] = useState("");

    // Streaming state
    const [client, setClient] = useState<StreamVideoClient>();
    const [call, setCall] = useState<Call>();
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Create & join on demand
    const handleConnect = useCallback(async () => {
        setError(null);

        if (!apiKey || !callId || !userId || !token) {
            setError("Please fill in apiKey, callId, userId, and token.");
            return;
        }

        setIsConnecting(true);
        try {
            // Token provider bound to the entered token
            const tokenProvider = async () => token;

            const myClient = new StreamVideoClient({
                apiKey,
                user: { id: userId },
                tokenProvider,
            });

            const myCall = myClient.call("livestream", callId);

            await myCall.join({ create: true });
            setClient(myClient);
            setCall(myCall);
        } catch (e: any) {
            console.error("Failed to connect/join:", e);
            setError(e?.message ?? "Failed to connect. Check your credentials.");
        } finally {
            setIsConnecting(false);
        }
    }, [apiKey, callId, token, userId]);

    // Cleanup when unmounting or when disconnecting
    useEffect(() => {
        return () => {
            if (call) {
                call.leave().catch(() => {});
            }
            if (client) {
                client.disconnectUser().catch(() => {});
            }
        };
    }, [call, client]);

    const handleDisconnect = useCallback(async () => {
        setIsConnecting(true);
        try {
            if (call) {
                await call.leave();
            }
            if (client) {
                await client.disconnectUser();
            }
        } catch (e) {
            // swallow
        } finally {
            setCall(undefined);
            setClient(undefined);
            setIsConnecting(false);
        }
    }, [call, client]);

    // Show form until connected
    if (!client || !call) {
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
                    onClick={handleConnect}
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

    // Connected: render the Stream components
    return (
        <StreamVideo client={client}>
            <StreamTheme className="my-theme-overrides">
                <StreamCall call={call}>
                    <div style={{ position: "fixed", top: 12, right: 12, zIndex: 10 }}>
                        <button
                            onClick={handleDisconnect}
                            disabled={isConnecting}
                            style={{
                                padding: "8px 12px",
                                borderRadius: 8,
                                border: "1px solid #ddd",
                                background: "white",
                                cursor: "pointer",
                            }}
                        >
                            Disconnect
                        </button>
                    </div>
                    <SpeakerLayout />
                    <CallControls />
                </StreamCall>
            </StreamTheme>
        </StreamVideo>
    );
}