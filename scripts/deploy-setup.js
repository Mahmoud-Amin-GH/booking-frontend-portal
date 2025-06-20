#!/usr/bin/env node

/**
 * Deployment Setup Script
 * Helps configure environment variables for different deployment environments
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(text) {
  return new Promise((resolve) => {
    rl.question(text, resolve);
  });
}

async function main() {
  console.log('🚀 Booking Portal Deployment Setup\n');
  
  console.log('This script will help you configure environment variables for deployment.\n');
  
  const environment = await question('Which environment are you setting up? (development/production): ');
  
  if (environment.toLowerCase() === 'production') {
    await setupProduction();
  } else {
    await setupDevelopment();
  }
  
  rl.close();
}

async function setupProduction() {
  console.log('\n📦 Setting up Production Environment\n');
  
  const backendUrl = await question('Enter your backend URL (e.g., https://your-backend.vercel.app): ');
  
  const envContent = `# Production Environment Variables
REACT_APP_API_URL=${backendUrl}/api

# Optional: Add analytics or other production configs
# REACT_APP_ANALYTICS_ID=your-analytics-id
`;

  fs.writeFileSync('.env.production', envContent);
  console.log('✅ .env.production file created!');
  
  console.log('\n📋 Next Steps:');
  console.log('1. Set REACT_APP_API_URL in your Vercel project environment variables');
  console.log('2. Make sure your backend CORS_ORIGINS includes your frontend domain');
  console.log('3. Deploy to Vercel');
}

async function setupDevelopment() {
  console.log('\n🛠️ Setting up Development Environment\n');
  
  const backendUrl = await question('Enter your backend URL (default: http://localhost:8080): ') || 'http://localhost:8080';
  
  const envContent = `# Development Environment Variables
REACT_APP_API_URL=${backendUrl}/api
`;

  fs.writeFileSync('.env.development', envContent);
  console.log('✅ .env.development file created!');
  
  console.log('\n📋 Next Steps:');
  console.log('1. Start your backend server');
  console.log('2. Run: npm start');
}

main().catch(console.error); 