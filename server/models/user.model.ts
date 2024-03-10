    import {Schema, model, Document} from "mongoose";

    interface IUser extends Document {
        firstName: string;
        lastName: string;
        username: string;
        passwordHash: string;
        salt: string;
        createdAt: Date;
    }

    const userSchema = new Schema<IUser>({
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        username: { type: String, unique: true, required: true },
        passwordHash: { type: String, required: true },
        salt: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
    });

    const UserModel = model<IUser>('User', userSchema);

    export default UserModel;
