import mongoose from 'mongoose';
import { env } from '../config/env';
import { User } from '../models/User.model';
import { Lead } from '../models/Lead.model';
import { LeadStatus, LeadSource, UserRole } from '../../../shared/types';

const seedData = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Lead.deleteMany({});
    console.log('Cleared existing data.');

    // Create users
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@smartleads.com',
      password: 'Admin@123',
      role: UserRole.ADMIN,
    });

    const salesUser = await User.create({
      name: 'Sales User',
      email: 'sales@smartleads.com',
      password: 'Sales@123',
      role: UserRole.SALES,
    });

    console.log('Created demo users.');

    // Sample leads
    const leads = [
      { name: 'Rahul Sharma', email: 'rahul.sharma@example.com', status: LeadStatus.NEW, source: LeadSource.WEBSITE, createdBy: salesUser._id },
      { name: 'Priya Patel', email: 'priya.patel@example.com', status: LeadStatus.CONTACTED, source: LeadSource.INSTAGRAM, createdBy: salesUser._id },
      { name: 'Amit Kumar', email: 'amit.kumar@example.com', status: LeadStatus.QUALIFIED, source: LeadSource.REFERRAL, createdBy: adminUser._id },
      { name: 'Sneha Gupta', email: 'sneha.gupta@example.com', status: LeadStatus.LOST, source: LeadSource.WEBSITE, createdBy: salesUser._id },
      { name: 'Vikram Singh', email: 'vikram.singh@example.com', status: LeadStatus.NEW, source: LeadSource.INSTAGRAM, createdBy: adminUser._id },
      { name: 'Anjali Desai', email: 'anjali.desai@example.com', status: LeadStatus.CONTACTED, source: LeadSource.REFERRAL, createdBy: salesUser._id },
      { name: 'Rohan Mehta', email: 'rohan.mehta@example.com', status: LeadStatus.QUALIFIED, source: LeadSource.WEBSITE, createdBy: adminUser._id },
      { name: 'Kavita Joshi', email: 'kavita.joshi@example.com', status: LeadStatus.NEW, source: LeadSource.INSTAGRAM, createdBy: salesUser._id },
      { name: 'Deepak Verma', email: 'deepak.verma@example.com', status: LeadStatus.CONTACTED, source: LeadSource.WEBSITE, createdBy: adminUser._id },
      { name: 'Nisha Agarwal', email: 'nisha.agarwal@example.com', status: LeadStatus.LOST, source: LeadSource.REFERRAL, createdBy: salesUser._id },
      { name: 'Sanjay Reddy', email: 'sanjay.reddy@example.com', status: LeadStatus.QUALIFIED, source: LeadSource.INSTAGRAM, createdBy: adminUser._id },
      { name: 'Meera Iyer', email: 'meera.iyer@example.com', status: LeadStatus.NEW, source: LeadSource.WEBSITE, createdBy: salesUser._id },
      { name: 'Arjun Nair', email: 'arjun.nair@example.com', status: LeadStatus.CONTACTED, source: LeadSource.REFERRAL, createdBy: adminUser._id },
      { name: 'Pooja Rao', email: 'pooja.rao@example.com', status: LeadStatus.QUALIFIED, source: LeadSource.INSTAGRAM, createdBy: salesUser._id },
      { name: 'Karan Malhotra', email: 'karan.malhotra@example.com', status: LeadStatus.LOST, source: LeadSource.WEBSITE, createdBy: adminUser._id },
      { name: 'Divya Chopra', email: 'divya.chopra@example.com', status: LeadStatus.NEW, source: LeadSource.REFERRAL, createdBy: salesUser._id },
      { name: 'Manish Tiwari', email: 'manish.tiwari@example.com', status: LeadStatus.CONTACTED, source: LeadSource.INSTAGRAM, createdBy: adminUser._id },
      { name: 'Ritu Saxena', email: 'ritu.saxena@example.com', status: LeadStatus.QUALIFIED, source: LeadSource.WEBSITE, createdBy: salesUser._id },
      { name: 'Suresh Pandey', email: 'suresh.pandey@example.com', status: LeadStatus.NEW, source: LeadSource.REFERRAL, createdBy: adminUser._id },
      { name: 'Lakshmi Menon', email: 'lakshmi.menon@example.com', status: LeadStatus.LOST, source: LeadSource.INSTAGRAM, createdBy: salesUser._id },
    ];

    await Lead.insertMany(leads);
    console.log(`Seeded ${leads.length} leads.`);

    console.log('\n✅ Seed completed successfully!');
    console.log('Admin: admin@smartleads.com / Admin@123');
    console.log('Sales: sales@smartleads.com / Sales@123');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedData();
