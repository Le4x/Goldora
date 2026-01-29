import { PrismaClient, UserRole, SubscriptionPlan, SubscriptionStatus } from '../generated/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create demo organization
  const org = await prisma.organization.upsert({
    where: { siret: '12345678901234' },
    update: {},
    create: {
      name: 'EmpORrium - Agence Paris',
      address: '12 Rue de la Paix',
      phone: '+33 1 42 00 00 00',
      email: 'contact@emporrium.fr',
      siret: '12345678901234',
      subscriptionPlan: SubscriptionPlan.PRO,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
      maxUsers: 999,
      maxTransactionsPerMonth: 999999,
      invoicePrefix: 'EMP',
      metalMargins: {
        GOLD: 5.0,
        SILVER: 8.0,
        PLATINUM: 6.0,
        PALLADIUM: 7.0,
      },
    },
  });

  // Create admin user (password: Admin123!)
  const adminHash = await bcrypt.hash('Admin123!', 12);

  await prisma.user.upsert({
    where: { email: 'admin@emporrium.fr' },
    update: { passwordHash: adminHash },
    create: {
      email: 'admin@emporrium.fr',
      passwordHash: adminHash,
      firstName: 'Jean',
      lastName: 'Dupont',
      role: UserRole.ADMIN,
      organizationId: org.id,
    },
  });

  // Create seller user (password: Seller123!)
  const sellerHash = await bcrypt.hash('Seller123!', 12);

  await prisma.user.upsert({
    where: { email: 'vendeur@emporrium.fr' },
    update: { passwordHash: sellerHash },
    create: {
      email: 'vendeur@emporrium.fr',
      passwordHash: sellerHash,
      firstName: 'Marie',
      lastName: 'Martin',
      role: UserRole.SELLER,
      organizationId: org.id,
    },
  });

  console.log('Seed completed.');
  console.log('Admin: admin@emporrium.fr / Admin123!');
  console.log('Vendeur: vendeur@emporrium.fr / Seller123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
