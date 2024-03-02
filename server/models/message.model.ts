import { Schema, model, Document } from 'mongoose';

interface IMessage extends Document {
    text: string;
    chatId: Schema.Types.ObjectId; // Chat ID
    authorId: Schema.Types.ObjectId; // User ID
    readBy: Schema.Types.ObjectId[]; // User IDs
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
    text: { type: String, required: true },
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const MessageModel = model<IMessage>('Message', messageSchema);

export default MessageModel;
