const { PrismaClient } = require("./generated/prisma");
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Starting database seeding...");

    console.log("Clearing existing Account data...");
    await prisma.account.deleteMany({});

    // Mock account data
    const accountData = [
      {
        account_id: "ACC001",
        username: "john_doe",
        password: "hashed_password_001",
      },
      {
        account_id: "ACC002",
        username: "jane_smith",
        password: "hashed_password_002",
      },
      {
        account_id: "ACC003",
        username: "mike_wilson",
        password: "hashed_password_003",
      },
      {
        account_id: "ACC004",
        username: "sarah_jones",
        password: "hashed_password_004",
      },
      {
        account_id: "ACC005",
        username: "david_brown",
        password: "hashed_password_005",
      },
      {
        account_id: "ACC006",
        username: "lisa_davis",
        password: "hashed_password_006",
      },
      {
        account_id: "ACC007",
        username: "alex_miller",
        password: "hashed_password_007",
      },
      {
        account_id: "ACC008",
        username: "emma_garcia",
        password: "hashed_password_008",
      },
      {
        account_id: "ACC009",
        username: "chris_lee",
        password: "hashed_password_009",
      },
      {
        account_id: "ACC010",
        username: "amy_taylor",
        password: "hashed_password_010",
      },
    ];

    // Insert mock accounts using createMany
    console.log("Inserting mock account data...");
    const result = await prisma.account.createMany({
      data: accountData,
      skipDuplicates: true, // Skip if any duplicate account_id exists
    });

    console.log(`Successfully created ${result.count} accounts`);

    // Display inserted data
    console.log("Fetching and displaying inserted accounts...");
    const accounts = await prisma.account.findMany({
      orderBy: {
        account_id: "asc",
      },
    });

    console.log("\nInserted accounts:");
    console.table(accounts);
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log("\nDatabase seeding completed!");
  }
}

main();
