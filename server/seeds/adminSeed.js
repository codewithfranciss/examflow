const prisma = require('../config/db');
const bcrypt = require('bcrypt');

async function main() {
  const email = 'admin@gmail.com';
  const plainPassword = 'admin123'; // choose a secure password
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // Check if admin already exists
  const existingAdmin = await prisma.admin.findUnique({ where: { email } });

  if (existingAdmin) {
    console.log('Admin already exists:', email);
    return;
  }

  // Create new admin
  const admin = await prisma.admin.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  console.log('Admin created successfully:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
