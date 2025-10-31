import { PrismaClient } from "@prisma/client"
import * as fs from "fs"
import * as path from "path"
import * as bcrypt from "bcrypt"
import { fileURLToPath } from "url"
import Papa from "papaparse"

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prisma = new PrismaClient()

// Command line arguments parsing
const args = process.argv.slice(2)
const isClear = args[0] === "clear"
const tableFilter = isClear ? args[1] : args[0]

// Helper function to read CSV files
function readCSV(filename: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, "../mock_data/csv_output", filename)

    if (!fs.existsSync(filePath)) {
      console.warn(`Warning: ${filename} not found, skipping...`)
      resolve([])
      return
    }

    const csvData = fs.readFileSync(filePath, "utf8")

    Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false, // Keep as strings for manual parsing
      transform: (value, header) => {
        // Trim whitespace from all values
        return typeof value === "string" ? value.trim() : value
      },
      complete: results => {
        resolve(results.data)
      },
      error: (error: any) => {
        reject(error)
      },
    })
  })
}

// Helper function to parse values
function parseValue(
  value: string,
  type:
    | "string"
    | "number"
    | "boolean"
    | "date"
    | "datetime"
    | "time"
    | "decimal"
): any {
  if (!value || value === "" || value.toLowerCase() === "null") return null

  switch (type) {
    case "boolean":
      return value.toLowerCase() === "true" || value === "1"
    case "number":
      return parseInt(value, 10)
    case "decimal":
      return parseFloat(value)
    case "date":
      return new Date(value)
    case "datetime":
      return new Date(value)
    case "time":
      // Handle time format (HH:MM:SS or HH:MM)
      if (value.includes(":")) {
        const [hours, minutes, seconds = "00"] = value.split(":")
        return new Date(
          `1970-01-01T${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}.000Z`
        )
      }
      return new Date(`1970-01-01T${value}:00:00.000Z`)
    default:
      return value
  }
}

// Clear functions
async function clearAllTables() {
  console.log("🧹 Clearing all tables...")

  // Clear in reverse dependency order
  await prisma.review.deleteMany()
  await prisma.report.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.transactionAccount.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.course.deleteMany()
  await prisma.prophetMethod.deleteMany()
  await prisma.prophetAvailability.deleteMany()
  await prisma.prophet.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.userDetail.deleteMany()
  await prisma.account.deleteMany()
  await prisma.horoscopeMethod.deleteMany()

  console.log("✅ All tables cleared")
}

async function clearTable(tableName: string) {
  console.log(`🧹 Clearing table: ${tableName}`)

  switch (tableName.toLowerCase()) {
    case "account":
      await prisma.account.deleteMany()
      break
    case "user_detail":
      await prisma.userDetail.deleteMany()
      break
    case "customer":
      await prisma.customer.deleteMany()
      break
    case "prophet":
      await prisma.prophet.deleteMany()
      break
    case "horoscope_method":
      await prisma.horoscopeMethod.deleteMany()
      break
    case "prophet_availability":
      await prisma.prophetAvailability.deleteMany()
      break
    case "prophet_method":
      await prisma.prophetMethod.deleteMany()
      break
    case "course":
      await prisma.course.deleteMany()
      break
    case "booking":
      await prisma.booking.deleteMany()
      break
    case "transaction":
      await prisma.transaction.deleteMany()
      break
    case "transaction_account":
      await prisma.transactionAccount.deleteMany()
      break
    case "review":
      await prisma.review.deleteMany()
      break
    case "report":
      await prisma.report.deleteMany()
      break
    default:
      console.warn(`Unknown table: ${tableName}`)
  }
}

// Seed functions
async function seedHoroscopeMethods() {
  console.log("🌟 Seeding horoscope methods...")
  const data = await readCSV("horoscope_methods.csv")

  for (const row of data) {
    await prisma.horoscopeMethod.upsert({
      where: { id: parseValue(row.id, "number") },
      update: {},
      create: {
        id: parseValue(row.id, "number"),
        slug: parseValue(row.slug, "string"),
        name: parseValue(row.name, "string"),
      },
    })
  }
  console.log(`✅ Seeded ${data.length} horoscope methods`)
}

async function seedAccounts() {
  console.log("👤 Seeding accounts...")
  const data = await readCSV("accounts.csv")
  let successCount = 0
  let errorCount = 0
  const usedUsernames = new Set<string>()
  const usedEmails = new Set<string>()

  for (const row of data) {
    try {
      const username = parseValue(row.username, "string")
      const email = parseValue(row.email, "string")

      // Check for unique username and email
      if (usedUsernames.has(username)) {
        console.warn(
          `⚠️  Skipping account ${row.id}: duplicate username ${username}`
        )
        errorCount++
        continue
      }

      if (usedEmails.has(email)) {
        console.warn(`⚠️  Skipping account ${row.id}: duplicate email ${email}`)
        errorCount++
        continue
      }

      await prisma.account.upsert({
        where: { id: parseValue(row.id, "string") },
        update: {},
        create: {
          id: parseValue(row.id, "string"),
          email: email,
          username: username,
          passwordHash: parseValue(row.password_hash, "string"),
          role: parseValue(row.role, "string") as any,
          createdAt: parseValue(row.created_at, "datetime"),
          updatedAt: parseValue(row.updated_at, "datetime"),
        },
      })

      usedUsernames.add(username)
      usedEmails.add(email)
      successCount++
    } catch (error: any) {
      console.warn(`⚠️  Error seeding account ${row.id}:`, error.message)
      errorCount++
    }
  }
  console.log(`✅ Seeded ${successCount} accounts (${errorCount} skipped)`)
}

async function seedUserDetails() {
  console.log("📝 Seeding user details...")
  const data = await readCSV("user_details.csv")

  for (const row of data) {
    await prisma.userDetail.upsert({
      where: { accountId: parseValue(row.account_id, "string") },
      update: {
        name: parseValue(row.name, "string"),
        lastname: parseValue(row.lastname, "string"),
        profileUrl: parseValue(row.profile_url, "string"),
        phoneNumber: parseValue(row.phone_number, "string"),
        gender: parseValue(row.gender, "string") as any,
        updatedAt: new Date(),
      },
      create: {
        accountId: parseValue(row.account_id, "string"),
        name: parseValue(row.name, "string"),
        lastname: parseValue(row.lastname, "string"),
        profileUrl: parseValue(row.profile_url, "string"),
        phoneNumber: parseValue(row.phone_number, "string"),
        gender: parseValue(row.gender, "string") as any,
        createdAt: parseValue(row.created_at, "datetime"),
        updatedAt: parseValue(row.updated_at, "datetime"),
      },
    })
  }
  console.log(`✅ Seeded ${data.length} user details`)
}

async function seedCustomers() {
  console.log("🛍️ Seeding customers...")
  const data = await readCSV("customers.csv")

  for (const row of data) {
    await prisma.customer.upsert({
      where: { id: parseValue(row.id, "string") },
      update: {},
      create: {
        id: parseValue(row.id, "string"),
        accountId: parseValue(row.account_id, "string"),
        birthDate: parseValue(row.birth_date, "date"),
        birthTime: parseValue(row.birth_time, "time"),
        zodiacSign: parseValue(row.zodiac_sign, "string") as any,
        createdAt: parseValue(row.created_at, "datetime"),
        updatedAt: parseValue(row.updated_at, "datetime"),
      },
    })
  }
  console.log(`✅ Seeded ${data.length} customers`)
}

async function seedProphets() {
  console.log("🔮 Seeding prophets...")
  const data = await readCSV("prophets.csv")
  let successCount = 0
  let errorCount = 0

  // First, verify all accounts exist
  const existingAccounts = await prisma.account.findMany({
    where: { role: "PROPHET" },
    select: { id: true },
  })
  const existingAccountIds = new Set(existingAccounts.map(acc => acc.id))

  for (const row of data) {
    const accountId = parseValue(row.account_id, "string")

    try {
      // Check if the account exists and is a prophet account
      if (!existingAccountIds.has(accountId)) {
        console.warn(
          `⚠️  Skipping prophet ${accountId}: account not found or not a prophet account`
        )
        errorCount++
        continue
      }

      await prisma.prophet.upsert({
        where: { id: parseValue(row.id, "string") },
        update: {},
        create: {
          id: parseValue(row.id, "string"),
          accountId: accountId,
          lineId: parseValue(row.line_id, "string"),
          createdAt: parseValue(row.created_at, "datetime"),
          updatedAt: parseValue(row.updated_at, "datetime"),
        },
      })
      successCount++
    } catch (error: any) {
      console.warn(`⚠️  Error seeding prophet ${accountId}:`, error.message)
      errorCount++
    }
  }

  console.log(`✅ Seeded ${successCount} prophets (${errorCount} skipped)`)
}

async function seedProphetAvailabilities() {
  console.log("📅 Seeding prophet availabilities...")
  const data = await readCSV("prophet_availabilities.csv")
  let successCount = 0
  let skipCount = 0

  for (const row of data) {
    const prophetId = parseValue(row.prophet_id, "string")
    const date = parseValue(row.date, "date")
    const startTime = parseValue(row.start_time, "time")

    try {
      // Check if an identical availability already exists
      const existingAvailability = await prisma.prophetAvailability.findFirst({
        where: {
          prophetId: prophetId,
          date: date,
          startTime: startTime,
        },
      })

      if (existingAvailability) {
        skipCount++
        continue
      }

      // Create new availability
      await prisma.prophetAvailability.create({
        data: {
          prophetId: prophetId,
          date: date,
          startTime: startTime,
          createdAt: parseValue(row.created_at, "datetime"),
        },
      })

      successCount++
    } catch (error: any) {
      console.warn(
        `⚠️  Error seeding prophet availability for prophet ${prophetId}:`,
        error.message
      )
      skipCount++
    }
  }

  console.log(
    `✅ Seeded ${successCount} prophet availabilities (${skipCount} skipped)`
  )
}

async function seedProphetMethods() {
  console.log("🔗 Seeding prophet methods...")
  const data = await readCSV("prophet_methods.csv")

  for (const row of data) {
    await prisma.prophetMethod.upsert({
      where: {
        prophetId_methodId: {
          prophetId: parseValue(row.prophet_id, "string"),
          methodId: parseValue(row.method_id, "number"),
        },
      },
      update: {},
      create: {
        prophetId: parseValue(row.prophet_id, "string"),
        methodId: parseValue(row.method_id, "number"),
      },
    })
  }
  console.log(`✅ Seeded ${data.length} prophet methods`)
}

async function seedCourses() {
  console.log("📚 Seeding courses...")
  const data = await readCSV("courses.csv")

  for (const row of data) {
    await prisma.course.upsert({
      where: { id: parseValue(row.id, "string") },
      update: {},
      create: {
        id: parseValue(row.id, "string"),
        prophetId: parseValue(row.prophet_id, "string"),
        courseName: parseValue(row.course_name, "string"),
        courseDescription: "",
        horoscopeMethodId: parseValue(row.horoscope_method_id, "number"),
        horoscopeSector: parseValue(row.horoscope_sector, "string") as any,
        durationMin: parseValue(row.duration_min, "number"),
        price: parseValue(row.price, "decimal"),
        isActive: parseValue(row.is_active, "boolean") ?? true,
        createdAt: parseValue(row.created_at, "datetime"),
        updatedAt: parseValue(row.updated_at, "datetime"),
      },
    })
  }
  console.log(`✅ Seeded ${data.length} courses`)
}

async function seedBookings() {
  console.log("📅 Seeding bookings...")
  const data = await readCSV("bookings.csv")

  for (const row of data) {
    const prophetId = parseValue(row.prophet_id, "string")
    const startDateTime = parseValue(row.start_datetime, "datetime")
    const endDateTime = parseValue(row.end_datetime, "datetime")

    await prisma.booking.upsert({
      where: {
        prophetId_startDateTime_endDateTime: {
          prophetId: prophetId,
          startDateTime: startDateTime,
          endDateTime: endDateTime,
        },
      },
      update: {},
      create: {
        id: parseValue(row.id, "string"),
        customerId: parseValue(row.customer_id, "string"),
        courseId: parseValue(row.course_id, "string"),
        prophetId: prophetId,
        startDateTime: startDateTime,
        endDateTime: endDateTime,
        status: parseValue(row.status, "string") as any,
        createdAt: parseValue(row.created_at, "datetime"),
      },
    })
  }
  console.log(`✅ Seeded ${data.length} bookings`)
}

async function seedTransactions() {
  console.log("💰 Seeding transactions...")
  const data = await readCSV("transactions.csv")
  let successCount = 0
  let errorCount = 0

  for (const row of data) {
    try {
      const bookingId = parseValue(row.booking_id, "string")

      // Check if booking exists
      const bookingExists = await prisma.booking.findUnique({
        where: { id: bookingId },
        select: { id: true },
      })

      if (!bookingExists) {
        console.warn(
          `⚠️  Skipping transaction ${row.id}: booking ${bookingId} not found`
        )
        errorCount++
        continue
      }

      await prisma.transaction.upsert({
        where: { id: parseValue(row.id, "string") },
        update: {},
        create: {
          id: parseValue(row.id, "string"),
          bookingId: bookingId,
          status: parseValue(row.status, "string") as any,
          createdAt: parseValue(row.created_at, "datetime"),
          updatedAt: parseValue(row.updated_at, "datetime"),
          amount: parseValue("100.00", "decimal"),
        },
      })
      successCount++
    } catch (error: any) {
      console.warn(`⚠️  Error seeding transaction ${row.id}:`, error.message)
      errorCount++
    }
  }
  console.log(
    `✅ Seeded ${successCount} transactions (${errorCount} skipped due to errors)`
  )
}

async function seedTransactionAccounts() {
  console.log("🏦 Seeding transaction accounts...")
  const data = await readCSV("transaction_accounts.csv")

  for (const row of data) {
    const prophetId = parseValue(row.prophet_id, "string")
    const bank = parseValue(row.bank, "string") as any
    const accountNumber = parseValue(row.account_number, "string")

    await prisma.transactionAccount.upsert({
      where: {
        prophetId_bank_accountNumber: {
          prophetId: prophetId,
          bank: bank,
          accountNumber: accountNumber,
        },
      },
      update: {},
      create: {
        id: parseValue(row.id, "string"),
        prophetId: prophetId,
        accountName: parseValue(row.account_name, "string"),
        accountNumber: accountNumber,
        bank: bank,
        createdAt: parseValue(row.created_at, "datetime"),
        updatedAt: parseValue(row.updated_at, "datetime"),
      },
    })
  }
  console.log(`✅ Seeded ${data.length} transaction accounts`)
}

async function seedReviews() {
  console.log("⭐ Seeding reviews...")
  const data = await readCSV("reviews.csv")
  let successCount = 0
  let errorCount = 0

  for (const row of data) {
    try {
      const customerId = parseValue(row.customer_id, "string")
      const bookingId = parseValue(row.booking_id, "string")

      // Check if customer and booking exist
      const [customerExists, bookingExists] = await Promise.all([
        prisma.customer.findUnique({
          where: { id: customerId },
          select: { id: true },
        }),
        prisma.booking.findUnique({
          where: { id: bookingId },
          select: { id: true },
        }),
      ])

      if (!customerExists) {
        console.warn(
          `⚠️  Skipping review ${row.id}: customer ${customerId} not found`
        )
        errorCount++
        continue
      }

      if (!bookingExists) {
        console.warn(
          `⚠️  Skipping review ${row.id}: booking ${bookingId} not found`
        )
        errorCount++
        continue
      }

      await prisma.review.upsert({
        where: { id: parseValue(row.id, "string") },
        update: {},
        create: {
          id: parseValue(row.id, "string"),
          customerId: customerId,
          bookingId: bookingId,
          score: parseValue(row.score, "number"),
          description: parseValue(row.description, "string"),
          createdAt: parseValue(row.created_at, "datetime"),
          updatedAt: parseValue(row.updated_at, "datetime"),
        },
      })
      successCount++
    } catch (error: any) {
      console.warn(`⚠️  Error seeding review ${row.id}:`, error.message)
      errorCount++
    }
  }
  console.log(
    `✅ Seeded ${successCount} reviews (${errorCount} skipped due to errors)`
  )
}

async function seedReports() {
  console.log("📋 Seeding reports...")
  const data = await readCSV("reports.csv")
  let successCount = 0
  let errorCount = 0

  for (const row of data) {
    try {
      const customerId = parseValue(row.customer_id, "string")
      const adminId = parseValue(row.admin_id, "string")

      // Check if customer exists
      const customerExists = await prisma.customer.findUnique({
        where: { id: customerId },
        select: { id: true },
      })

      if (!customerExists) {
        console.warn(
          `⚠️  Skipping report ${row.id}: customer ${customerId} not found`
        )
        errorCount++
        continue
      }

      // Check if admin exists (if adminId is provided)
      if (adminId) {
        const adminExists = await prisma.account.findUnique({
          where: { id: adminId },
          select: { id: true },
        })

        if (!adminExists) {
          console.warn(
            `⚠️  Skipping report ${row.id}: admin ${adminId} not found`
          )
          errorCount++
          continue
        }
      }

      await prisma.report.upsert({
        where: { id: parseValue(row.id, "string") },
        update: {},
        create: {
          id: parseValue(row.id, "string"),
          customerId: customerId,
          adminId: adminId,
          reportType: parseValue(row.report_type, "string") as any,
          topic: parseValue(row.topic, "string"),
          description: parseValue(row.description, "string"),
          reportStatus: parseValue(row.report_status, "string") as any,
          createdAt: parseValue(row.created_at, "datetime"),
          updatedAt: parseValue(row.updated_at, "datetime"),
        },
      })
      successCount++
    } catch (error: any) {
      console.warn(`⚠️  Error seeding report ${row.id}:`, error.message)
      errorCount++
    }
  }
  console.log(
    `✅ Seeded ${successCount} reports (${errorCount} skipped due to errors)`
  )
}

async function seedAllTables() {
  console.log("🌱 Starting full database seeding...")

  // Seed in dependency order
  await seedHoroscopeMethods()
  await seedAccounts()
  await seedUserDetails()
  await seedCustomers()
  await seedProphets()
  await seedProphetAvailabilities()
  await seedProphetMethods()
  await seedCourses()
  await seedBookings()
  await seedTransactions()
  await seedTransactionAccounts()
  await seedReviews()
  await seedReports()

  console.log("🎉 Database seeding completed!")
}

async function seedTable(tableName: string) {
  console.log(`🌱 Seeding table: ${tableName}`)

  switch (tableName.toLowerCase()) {
    case "horoscope_method":
      await seedHoroscopeMethods()
      break
    case "account":
      await seedAccounts()
      break
    case "user_detail":
      await seedUserDetails()
      break
    case "customer":
      await seedCustomers()
      break
    case "prophet":
      await seedProphets()
      break
    case "prophet_availability":
      await seedProphetAvailabilities()
      break
    case "prophet_method":
      await seedProphetMethods()
      break
    case "course":
      await seedCourses()
      break
    case "booking":
      await seedBookings()
      break
    case "transaction":
      await seedTransactions()
      break
    case "transaction_account":
      await seedTransactionAccounts()
      break
    case "review":
      await seedReviews()
      break
    case "report":
      await seedReports()
      break
    default:
      console.warn(`Unknown table: ${tableName}`)
  }
}

// Main execution
async function main() {
  try {
    console.log("🚀 Starting database operations...")

    if (isClear) {
      if (tableFilter) {
        await clearTable(tableFilter)
      } else {
        await clearAllTables()
      }
    } else {
      if (tableFilter) {
        await seedTable(tableFilter)
      } else {
        await seedAllTables()
      }
    }
  } catch (error) {
    console.error("❌ Error during database operation:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
