import mongoose from 'mongoose';
import { env } from './config/env';
import { User } from './models/User.model';
import { Lead } from './models/Lead.model';

async function check() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB successfully!');
    
    // Get all users
    const users = await User.find({});
    console.log('\n--- All Users ---');
    users.forEach(u => {
      console.log(`- Name: ${u.name}, Email: ${u.email}, Role: ${u.role}, CreatedAt: ${u.createdAt}`);
    });

    // Get 5 most recent leads
    const leads = await Lead.find({}).sort({ createdAt: -1 }).limit(5);
    console.log('\n--- 5 Most Recent Leads ---');
    leads.forEach(l => {
      console.log(`- Name: ${l.name}, Email: ${l.email}, Status: ${l.status}, CreatedBy: ${l.createdBy}, CreatedAt: ${l.createdAt}`);
    });

    // Total leads count
    const count = await Lead.countDocuments();
    console.log(`\nTotal Leads in DB: ${count}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error querying DB:', err);
    process.exit(1);
  }
}

check();
