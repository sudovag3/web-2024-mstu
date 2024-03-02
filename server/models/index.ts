import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

import UserModel from './user.model';
import ChatModel from './chat.model';
import MessageModel from './message.model';

interface Database {
    user: typeof UserModel;
    chat: typeof ChatModel;
    message: typeof MessageModel;
}

const db: Database = {
    user: UserModel,
    chat: ChatModel,
    message: MessageModel,
};

export default db;
