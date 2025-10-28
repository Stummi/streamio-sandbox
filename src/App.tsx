import { useCallback, useEffect, useState } from "react";
import { Call, StreamVideoClient } from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "./styles.css";
import ConnectForm, { type ConnectFormData } from "./ConnectForm";
import VideoCall from "./VideoCall";
import ChatWindow from "./ChatWindow.tsx";

export default function App() {
    // Streaming state
    const [client, setClient] = useState<StreamVideoClient>();
    const [call, setCall] = useState<Call>();
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<ConnectFormData | null>(null);

    // Create & join on demand
    const handleConnect = useCallback(async (formData: ConnectFormData) => {
        setError(null);
        setFormData(formData);

        const { apiKey, callId, userId, token } = formData;

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
        } catch (e: unknown) {
            console.error("Failed to connect/join:", e);
            setError((e as Error)?.message ?? "Failed to connect. Check your credentials.");
        } finally {
            setIsConnecting(false);
        }
    }, []);

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
        } catch (error) {
            console.error("Error during disconnect:", error);
        } finally {
            setCall(undefined);
            setClient(undefined);
            setIsConnecting(false);
        }
    }, [call, client]);

    // Show form until connected
    if (!client || !call) {
        return (
            <>
                <ConnectForm
                    onConnect={handleConnect}
                    isConnecting={isConnecting}
                    error={error}
                />
                {formData && <ChatWindow formData={formData} />}
            </>
        );
    }

    // Connected: render the Stream components
    return (
        <>
            <VideoCall
                client={client}
                call={call}
                onDisconnect={handleDisconnect}
                isDisconnecting={isConnecting}
            />
            {formData && <ChatWindow formData={formData} />}
        </>
    );
}