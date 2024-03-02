import { Schema, model, Document } from 'mongoose';

enum ChatType {
    Private = 'private',
    Public = 'public',
}

interface IChat extends Document {
    name: string;
    description: string;
    type: ChatType;
    createdAt: Date;
    participants: Schema.Types.ObjectId[]; // User IDs
    admins: Schema.Types.ObjectId[]; // User IDs
}

const chatSchema = new Schema<IChat>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: Object.values(ChatType), default: ChatType.Public },
    createdAt: { type: Date, default: Date.now },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    admins: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

const ChatModel = model<IChat>('Chat', chatSchema);

export default ChatModel;
