import 'dotenv/config';
import { seedStore } from './store.js';

const kind = await seedStore();
console.log(`Seeded FlowForge data into ${kind} storage.`);
