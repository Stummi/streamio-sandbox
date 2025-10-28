import {type ConnectFormData} from "./ConnectForm";
import {
    Channel,
    ChannelHeader,
    ChannelList, Chat,
    MessageInput,
    MessageList, Thread,
    useCreateChatClient,
    Window
} from "stream-chat-react";

interface ChatProps {
    formData: ConnectFormData;
}

export default function ChatWindow({formData}: ChatProps) {
    const apiKey = formData.apiKey
    const client = useCreateChatClient({
        apiKey,
        tokenOrProvider: formData.token,
        userData: {id: formData.userId},
    });

    const filters = { members: { $in: [formData.userId] }, type: "messaging" };
    const options = { presence: true, state: true };

    if (!client) return <div>Loading...</div>;
    return (
        <Chat client={client}>
            <ChannelList sort={{ last_message_at: -1 }} filters={filters} options={options}/>
            <Channel>
                <Window>
                    <ChannelHeader/>
                    <MessageList/>
                    <MessageInput/>
                </Window>
                <Thread/>
            </Channel>
        </Chat>
    )
}
