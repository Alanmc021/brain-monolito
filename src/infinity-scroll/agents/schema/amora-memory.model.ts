// import { Schema, Document } from 'mongoose';

// export interface AmoraMemory extends Document {
//   userId: string;
//   girlfriendId: string;
//   history: {
//     type: 'human' | 'ai' | 'system';
//     content: string;
//   }[];
//   createdAt: Date;
//   updatedAt: Date;
// }

// export const AmoraMemorySchema = new Schema({
//   userId: { type: String, required: true, index: true },
//   girlfriendId: { type: String, required: true, index: true },
//   history: [
//     {
//       type: {
//         type: String,
//         enum: ['human', 'ai', 'system'],
//         required: true,
//       },
//       content: { type: String, required: true },
//     },
//   ],
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });

// // Índice composto para garantir unicidade por usuário + namorada
// AmoraMemorySchema.index({ userId: 1, girlfriendId: 1 }, { unique: true });



// schema/amora-memory.model.ts
import { Schema, Document } from 'mongoose';

export interface AmoraMemory extends Document {
  userId: string;
  girlfriendId: string;
  history: {
    type: 'human' | 'ai' | 'system';
    content: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export const AmoraMemorySchema = new Schema({
  userId: { type: String, required: true, index: true },
  girlfriendId: { type: String, required: true, index: true },
  history: [
    {
      type: {
        type: String,
        enum: ['human', 'ai', 'system'],
        required: true,
      },
      content: { type: String, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Índice composto para garantir unicidade por usuário + narrador
AmoraMemorySchema.index({ userId: 1, girlfriendId: 1 }, { unique: true });

