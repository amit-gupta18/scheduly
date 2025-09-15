import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create Sellers
  const seller1 = await prisma.user.upsert({
    where: { email: "seller1@example.com" },
    update: {},
    create: {
      name: "Alice Seller",
      email: "seller1@example.com",
      role: "SELLER",
      image: "https://i.pravatar.cc/150?img=5",
    },
  });

  const seller2 = await prisma.user.upsert({
    where: { email: "seller2@example.com" },
    update: {},
    create: {
      name: "Bob Seller",
      email: "seller2@example.com",
      role: "SELLER",
      image: "https://i.pravatar.cc/150?img=6",
    },
  });

  // Create Buyers
  const buyer1 = await prisma.user.upsert({
    where: { email: "buyer1@example.com" },
    update: {},
    create: {
      name: "Charlie Buyer",
      email: "buyer1@example.com",
      role: "BUYER",
      image: "https://i.pravatar.cc/150?img=7",
    },
  });

  const buyer2 = await prisma.user.upsert({
    where: { email: "buyer2@example.com" },
    update: {},
    create: {
      name: "Diana Buyer",
      email: "buyer2@example.com",
      role: "BUYER",
      image: "https://i.pravatar.cc/150?img=8",
    },
  });

  // Create mock OAuth accounts for all users
  const users = [seller1, seller2, buyer1, buyer2];
  for (let i = 0; i < users.length; i++) {
    await prisma.account.upsert({
      where: {
        provider_providerAccountId: {
          provider: "google",
          providerAccountId: `mock-google-id-${i + 1}`,
        },
      },
      update: {},
      create: {
        userId: users[i].id,
        type: "oauth", // required by NextAuth
        provider: "google",
        providerAccountId: `mock-google-id-${i + 1}`,
        access_token: `access-token-${i + 1}`,
        refresh_token: `refresh-token-${i + 1}`,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
      },
    });
  }

  // Create Sample Appointments
  await prisma.appointment.createMany({
    data: [
      {
        buyerId: buyer1.id,
        sellerId: seller1.id,
        scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // tomorrow
        status: "PENDING",
      },
      {
        buyerId: buyer2.id,
        sellerId: seller2.id,
        scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 48), // 2 days later
        status: "CONFIRMED",
      },
    ],
  });

  console.log("✅ Database has been seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
