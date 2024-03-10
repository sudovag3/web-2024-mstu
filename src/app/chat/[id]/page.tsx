"use client"

import { useRouter } from 'next/navigation';
import ChatPage from "@/components/ChatPage";

const Chat = ({params: {id}} : {params: {id: string}}) => {
    const router = useRouter();
    return <ChatPage chatId={id} />
};

export default Chat;
