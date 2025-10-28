import {
    Call,
    CallControls,
    SpeakerLayout,
    StreamCall,
    StreamTheme,
    StreamVideo,
    StreamVideoClient,
} from "@stream-io/video-react-sdk";

interface VideoCallProps {
    client: StreamVideoClient;
    call: Call;
    onDisconnect: () => void;
    isDisconnecting: boolean;
}

export default function VideoCall({ client, call, onDisconnect, isDisconnecting }: VideoCallProps) {
    return (
        <StreamVideo client={client}>
            <StreamTheme className="my-theme-overrides">
                <StreamCall call={call}>
                    <div style={{ position: "fixed", top: 12, right: 12, zIndex: 10 }}>
                        <button
                            onClick={onDisconnect}
                            disabled={isDisconnecting}
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
