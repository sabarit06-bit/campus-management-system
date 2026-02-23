const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // You'll need this

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  authDomain: 'campusnextgen-acc9f.firebaseapp.com',
  projectId: 'campusnextgen-acc9f'
});

const auth = admin.auth();

const testAccounts = [
  { email: 'admin@campus.local', password: 'admin123', displayName: 'Admin User' },
  { email: 'teacher001@campus.local', password: 'teacher123', displayName: 'Teacher 001' },
  { email: '12345@campus.local', password: 'student123', displayName: 'Student 12345' }
];

async function createTestAccounts() {
  console.log('Creating test accounts...');
  
  for (const account of testAccounts) {
    try {
      const existingUser = await auth.getUserByEmail(account.email).catch(() => null);
      
      if (existingUser) {
        console.log(`✓ Account ${account.email} already exists`);
      } else {
        const user = await auth.createUser({
          email: account.email,
          password: account.password,
          displayName: account.displayName,
          emailVerified: true
        });
        console.log(`✓ Created account: ${account.email} (UID: ${user.uid})`);
      }
    } catch (error) {
      console.error(`✗ Error creating ${account.email}:`, error.message);
    }
  }
  
  console.log('\nTest account initialization complete!');
  process.exit(0);
}

createTestAccounts().catch(error => {
  console.error('Failed to initialize test accounts:', error);
  process.exit(1);
});
