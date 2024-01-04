import mongoose, { Schema } from 'mongoose';

const todoSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        finishDate: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

export const Todo = mongoose.model('Todo', todoSchema);
