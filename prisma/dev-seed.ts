import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import crypto from "crypto"

const prisma = new PrismaClient()

// Constants
const DEV_CUSTOMER_ID = "dev_customer_001"
const DEV_PROPHET_ID = "dev_prophet_001"
const DEV_ADMIN_ID = "dev_admin_001"

// Utility Functions
function generateShortId(prefix: string): string {
  return `${prefix}_${crypto.randomBytes(4).toString("hex")}`
}

// Step 1: Create Dev Accounts
async function createDevAccounts() {
  console.log("🛠️ Creating development accounts...")

  // Dev Customer Account
  const devCustomerAccount = await prisma.account.create({
    data: {
      id: DEV_CUSTOMER_ID,
      email: "dev_customer@gmail.com",
      username: "dev_customer",
      passwordHash: await bcrypt.hash("dev_password", 10),
      role: "CUSTOMER",
      userDetail: {
        create: {
          name: "Dev",
          lastname: "Customer",
          profileUrl: "https://example.com/profile/dev_customer.jpg",
          phoneNumber: "+66812345678",
          gender: "UNDEFINED",
        },
      },
      customer: {
        create: {
          id: DEV_CUSTOMER_ID,
          birthDate: new Date("1990-01-01"),
          birthTime: new Date("1970-01-01T12:00:00.000Z"),
          zodiacSign: "AQUARIUS",
        },
      },
    },
  })

  // Dev Prophet Account
  const devProphetAccount = await prisma.account.create({
    data: {
      id: DEV_PROPHET_ID,
      email: "dev_prophet@gmail.com",
      username: "dev_prophet",
      passwordHash: await bcrypt.hash("dev_password", 10),
      role: "PROPHET",
      userDetail: {
        create: {
          name: "Dev",
          lastname: "Prophet",
          profileUrl: "https://example.com/profile/dev_prophet.jpg",
          phoneNumber: "+66812345679",
          gender: "UNDEFINED",
        },
      },
      prophet: {
        create: {
          id: DEV_PROPHET_ID,
          lineId: "dev_prophet_line_id",
        },
      },
    },
  })

  // Dev Admin Account
  const devAdminAccount = await prisma.account.create({
    data: {
      id: DEV_ADMIN_ID,
      email: "dev_admin@gmail.com",
      username: "dev_admin",
      passwordHash: await bcrypt.hash("dev_password", 10),
      role: "ADMIN",
      userDetail: {
        create: {
          name: "Dev",
          lastname: "Admin",
          profileUrl: "https://example.com/profile/dev_admin.jpg",
          phoneNumber: "+66812345680",
          gender: "UNDEFINED",
        },
      },
    },
  })

  console.log("✅ Development accounts created")
}

// Step 2: Create Prophet Methods for Dev Prophet
async function createDevProphetMethods() {
  console.log("📚 Creating prophet methods for dev prophet...")

  // Fetch available horoscope methods
  const availableMethods = await prisma.horoscopeMethod.findMany()

  // Randomly select 3-5 methods for dev prophet
  const selectedMethods = availableMethods
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 3) + 3)

  for (const method of selectedMethods) {
    await prisma.prophetMethod.create({
      data: {
        prophetId: DEV_PROPHET_ID,
        methodId: method.id,
      },
    })
  }

  console.log(`✅ Created ${selectedMethods.length} prophet methods`)
}

// Step 3: Create Prophet Availabilities
async function createDevProphetAvailabilities() {
  console.log("📅 Creating prophet availabilities for dev prophet...")

  const now = new Date()
  const possibleMinutes = [0, 15, 30, 45]
  const possibleHours = [9, 10, 11, 14, 15, 16, 19, 20, 21]

  // Generate availabilities for next 30 days
  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const date = new Date(now)
    date.setDate(now.getDate() + dayOffset)

    // Skip dates in the past
    if (date < now) continue

    // Randomly determine number of availability slots (2-4)
    const numSlots = Math.floor(Math.random() * 3) + 2

    // Track used slots to prevent duplicates
    const usedSlots = new Set()

    for (let i = 0; i < numSlots; i++) {
      // Randomly select hour and minute
      const hour =
        possibleHours[Math.floor(Math.random() * possibleHours.length)]
      const minute =
        possibleMinutes[Math.floor(Math.random() * possibleMinutes.length)]

      // Create full datetime
      const availabilityDateTime = new Date(date)
      availabilityDateTime.setHours(hour, minute, 0, 0)

      // Skip if datetime is in the past or slot already used
      if (availabilityDateTime < now) continue

      const slotKey = `${availabilityDateTime.toISOString()}`
      if (usedSlots.has(slotKey)) continue

      // Create availability
      await prisma.prophetAvailability.create({
        data: {
          prophetId: DEV_PROPHET_ID,
          date: availabilityDateTime,
          startTime: availabilityDateTime,
          createdAt: new Date(),
        },
      })

      usedSlots.add(slotKey)
    }
  }

  console.log("✅ Prophet availabilities created")
}

// Step 4: Create Dev Prophet Courses
async function createDevProphetCourses() {
  console.log("📖 Creating courses for dev prophet...")

  // Fetch prophet methods for dev prophet
  const prophetMethods = await prisma.prophetMethod.findMany({
    where: { prophetId: DEV_PROPHET_ID },
    include: { method: true },
  })

  // Course data with variations
  const coursesData = [
    {
      name: "Basic Tarot Reading",
      sector: "LOVE",
      duration: 30,
      price: 500.0,
      description:
        "Introductory tarot card reading focusing on love and relationships",
    },
    {
      name: "Advanced Astrology Chart",
      sector: "WORK",
      duration: 60,
      price: 1200.0,
      description:
        "Comprehensive astrological analysis of career and professional path",
    },
    {
      name: "Premium Palm Reading",
      sector: "MONEY",
      duration: 45,
      price: 800.0,
      description:
        "Detailed palm reading exploring financial potential and opportunities",
    },
    {
      name: "Crystal Ball Consultation",
      sector: "FAMILY",
      duration: 90,
      price: 1500.0,
      description:
        "In-depth spiritual guidance focusing on family dynamics and relationships",
    },
    {
      name: "Numerology Life Path",
      sector: "LUCK",
      duration: 60,
      price: 1000.0,
      description:
        "Comprehensive numerology reading to understand life purpose and potential",
    },
  ]

  // Create courses, ensuring we have enough methods
  for (
    let i = 0;
    i < Math.min(coursesData.length, prophetMethods.length);
    i++
  ) {
    const course = coursesData[i]
    const method = prophetMethods[i]

    await prisma.course.create({
      data: {
        id: generateShortId("cs"),
        prophetId: DEV_PROPHET_ID,
        courseName: course.name,
        horoscopeMethodId: method.methodId,
        horoscopeSector: course.sector as any,
        durationMin: course.duration,
        price: course.price,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
  }

  console.log("✅ Courses for dev prophet created")
}

// Step 5: Create Dev Prophet Transaction Accounts
async function createDevProphetTransactionAccounts() {
  console.log("💳 Creating transaction accounts for dev prophet...")

  // Bank account details
  const bankAccounts = [
    {
      bank: "KBANK",
      accountName: "DevProphet1",
      accountNumber: "1234567890",
    },
    {
      bank: "SCB",
      accountName: "DevProphet2",
      accountNumber: "0987654321",
    },
    {
      bank: "BBL",
      accountName: "Business",
      accountNumber: "5678901234",
    },
  ]

  // Randomly select 1-2 accounts to create
  const selectedAccounts = bankAccounts
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 2) + 1)

  for (const account of selectedAccounts) {
    await prisma.transactionAccount.create({
      data: {
        id: generateShortId("txa"),
        prophetId: DEV_PROPHET_ID,
        accountName: account.accountName,
        accountNumber: account.accountNumber,
        bank: account.bank as any,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
  }

  console.log(`✅ Created ${selectedAccounts.length} transaction accounts`)
}
// Step 6: Bookings between Dev Customer and All Prophets
async function createDevCustomerBookings() {
  console.log("📅 Creating bookings for dev customer with all prophets...")

  const now = new Date()

  // Fetch ALL prophets who have active courses
  const allProphets = await prisma.prophet.findMany({
    where: {
      courses: { some: { isActive: true } },
    },
    include: {
      courses: {
        where: { isActive: true },
        take: 1,
      },
    },
  })

  if (allProphets.length === 0) {
    console.log("No prophets with active courses found. Skipping.")
    return
  }

  // 1. Fetch all future availability for these prophets at once
  const prophetIds = allProphets.map(p => p.id)
  const allAvailabilities = await prisma.prophetAvailability.findMany({
    where: {
      prophetId: { in: prophetIds },
      date: { gte: now }, // Only look for future slots
    },
    orderBy: {
      startTime: "asc",
    },
  })

  // 2. Pre-process availabilities by grouping and sorting them by prophet
  const availabilitiesByProphet = new Map()
  for (const slot of allAvailabilities) {
    if (!availabilitiesByProphet.has(slot.prophetId)) {
      availabilitiesByProphet.set(slot.prophetId, [])
    }
    // Combine date and startTime into a single JS Date object
    const startDateTime = new Date(slot.date)
    startDateTime.setHours(
      slot.startTime.getHours(),
      slot.startTime.getMinutes(),
      slot.startTime.getSeconds()
    )
    availabilitiesByProphet.get(slot.prophetId).push(startDateTime)
  }

  // This set will store unique keys for each 15-minute slot: `${prophetId}-${isoString}`
  const bookedSlots = new Set()

  // Create 4-5 bookings
  const bookingsToCreate = Math.floor(Math.random() * 2) + 4
  for (let i = 0; i < bookingsToCreate; i++) {
    // Select a random prophet from the full list
    const prophet = allProphets[Math.floor(Math.random() * allProphets.length)]

    if (prophet.courses.length === 0) continue

    const course = prophet.courses[0]
    const slotsNeeded = course.durationMin / 15

    const prophetSlots = availabilitiesByProphet.get(prophet.id) || []

    if (prophetSlots.length < slotsNeeded) {
      continue
    }

    let bookingCreated = false

    // Create a shuffled list of possible start indices to search from
    const possibleStartIndices = Array.from(
      { length: prophetSlots.length - slotsNeeded + 1 },
      (_, k) => k
    )
    for (let j = possibleStartIndices.length - 1; j > 0; j--) {
      const randIndex = Math.floor(Math.random() * (j + 1))
      ;[possibleStartIndices[j], possibleStartIndices[randIndex]] = [
        possibleStartIndices[randIndex],
        possibleStartIndices[j],
      ]
    }

    // 3. Search for a consecutive, available block of slots
    for (const startIndex of possibleStartIndices) {
      const potentialSlots = prophetSlots.slice(
        startIndex,
        startIndex + slotsNeeded
      )

      const isAlreadyBooked = potentialSlots.some(
        (slot: { toISOString: () => any }) =>
          bookedSlots.has(`${prophet.id}-${slot.toISOString()}`)
      )
      if (isAlreadyBooked) continue

      let isConsecutive = true
      for (let k = 0; k < potentialSlots.length - 1; k++) {
        const diffInMs =
          potentialSlots[k + 1].getTime() - potentialSlots[k].getTime()
        if (diffInMs !== 15 * 60 * 1000) {
          // 15 minutes in milliseconds
          isConsecutive = false
          break
        }
      }

      if (isConsecutive) {
        // Found a valid block, create the booking and related data
        const startDateTime = potentialSlots[0]
        const endDateTime = new Date(
          potentialSlots[potentialSlots.length - 1].getTime() + 15 * 60 * 1000
        )

        const booking = await prisma.booking.create({
          data: {
            id: generateShortId("bk"),
            customerId: DEV_CUSTOMER_ID,
            courseId: course.id,
            prophetId: prophet.id,
            startDateTime: startDateTime,
            endDateTime: endDateTime,
            status: i === 0 ? "COMPLETED" : i === 1 ? "SCHEDULED" : "FAILED",
            createdAt: new Date(),
          },
        })

        await prisma.transaction.create({
          data: {
            id: generateShortId("tx"),
            bookingId: booking.id,
            status: "PAID_OUT",
            amount: 2300,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        })

        if (booking.status === "COMPLETED") {
          await prisma.review.create({
            data: {
              id: generateShortId("rv"),
              customerId: DEV_CUSTOMER_ID,
              bookingId: booking.id,
              score: Math.floor(Math.random() * 3) + 3, // 3-5 score
              description: [
                "Great session! Very insightful.",
                "Helpful and professional reading.",
                "Exceeded my expectations.",
                "",
              ][Math.floor(Math.random() * 4)],
              createdAt: new Date(),
            },
          })
        }

        for (const slot of potentialSlots) {
          bookedSlots.add(`${prophet.id}-${slot.toISOString()}`)
        }

        bookingCreated = true
        break
      }
    }
  }

  console.log("✅ Bookings for dev customer created")
}

// Step 7: Bookings for Other Customers with Dev Prophet
async function createOtherCustomersDevProphetBookings() {
  console.log("📅 Creating bookings for other customers with dev prophet...")

  const now = new Date()

  // Fetch other customers
  const otherCustomers = await prisma.customer.findMany({
    where: { id: { not: DEV_CUSTOMER_ID } },
    take: 5, // We will create bookings for up to 5 customers
  })

  if (otherCustomers.length === 0) {
    console.log("No other customers found to create bookings for. Skipping.")
    return
  }

  // Fetch dev prophet's active courses
  const devProphetCourses = await prisma.course.findMany({
    where: {
      prophetId: DEV_PROPHET_ID,
      isActive: true,
    },
  })

  if (devProphetCourses.length === 0) {
    console.log("Dev prophet has no active courses. Skipping.")
    return
  }

  // 1. Fetch all future availability slots for the dev prophet
  const devProphetAvailabilities = await prisma.prophetAvailability.findMany({
    where: {
      prophetId: DEV_PROPHET_ID,
      date: { gte: now },
    },
    orderBy: {
      startTime: "asc",
    },
  })

  // 2. Pre-process the availability slots into a simple, sorted array of Date objects
  const devProphetAvailableSlots = devProphetAvailabilities.map(slot => {
    const startDateTime = new Date(slot.date)
    startDateTime.setHours(
      slot.startTime.getHours(),
      slot.startTime.getMinutes(),
      slot.startTime.getSeconds()
    )
    return startDateTime
  })

  // This set will store unique keys for each 15-minute slot: `${prophetId}-${isoString}`
  const bookedSlots = new Set()

  // Create 4-5 bookings for different customers
  const bookingsToCreate = Math.min(
    otherCustomers.length,
    Math.floor(Math.random() * 2) + 4
  )
  for (let i = 0; i < bookingsToCreate; i++) {
    // Select a customer and a random course from the dev prophet's list
    const customer = otherCustomers[i]
    const course =
      devProphetCourses[Math.floor(Math.random() * devProphetCourses.length)]

    const slotsNeeded = course.durationMin / 15

    if (devProphetAvailableSlots.length < slotsNeeded) {
      console.log(
        "Not enough total available slots for dev prophet to continue booking."
      )
      break
    }

    let bookingCreated = false

    // Create a shuffled list of possible start indices to search from
    const possibleStartIndices = Array.from(
      { length: devProphetAvailableSlots.length - slotsNeeded + 1 },
      (_, k) => k
    )
    for (let j = possibleStartIndices.length - 1; j > 0; j--) {
      const randIndex = Math.floor(Math.random() * (j + 1))
      ;[possibleStartIndices[j], possibleStartIndices[randIndex]] = [
        possibleStartIndices[randIndex],
        possibleStartIndices[j],
      ]
    }

    // 3. Search for a consecutive, available block of slots
    for (const startIndex of possibleStartIndices) {
      const potentialSlots = devProphetAvailableSlots.slice(
        startIndex,
        startIndex + slotsNeeded
      )

      const isAlreadyBooked = potentialSlots.some(slot =>
        bookedSlots.has(`${DEV_PROPHET_ID}-${slot.toISOString()}`)
      )
      if (isAlreadyBooked) continue

      let isConsecutive = true
      for (let k = 0; k < potentialSlots.length - 1; k++) {
        const diffInMs =
          potentialSlots[k + 1].getTime() - potentialSlots[k].getTime()
        if (diffInMs !== 15 * 60 * 1000) {
          // 15 minutes in milliseconds
          isConsecutive = false
          break
        }
      }

      if (isConsecutive) {
        // Found a valid block, create the booking and related data
        const startDateTime = potentialSlots[0]
        const endDateTime = new Date(
          potentialSlots[potentialSlots.length - 1].getTime() + 15 * 60 * 1000
        )

        const booking = await prisma.booking.create({
          data: {
            id: generateShortId("devbk"),
            customerId: customer.id,
            courseId: course.id,
            prophetId: DEV_PROPHET_ID,
            startDateTime: startDateTime,
            endDateTime: endDateTime,
            status: i < 2 ? "COMPLETED" : i < 4 ? "SCHEDULED" : "FAILED",
            createdAt: new Date(),
          },
        })

        await prisma.transaction.create({
          data: {
            id: generateShortId("devt"),
            bookingId: booking.id,
            status: "PAID_OUT",
            amount: 1500,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        })

        if (booking.status === "COMPLETED") {
          await prisma.review.create({
            data: {
              id: generateShortId("drv"),
              customerId: customer.id,
              bookingId: booking.id,
              score: Math.floor(Math.random() * 3) + 3, // 3-5 score
              description: [
                "Excellent prophet session!",
                "Very insightful and professional reading.",
                "Highly recommend this prophet.",
                "",
              ][Math.floor(Math.random() * 4)],
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          })
        }

        // Mark all individual slots as used for this script run
        for (const slot of potentialSlots) {
          bookedSlots.add(`${DEV_PROPHET_ID}-${slot.toISOString()}`)
        }

        bookingCreated = true
        break // Exit search loop and create the next booking
      }
    }
  }

  console.log("✅ Bookings for other customers with dev prophet created")
}

// Step 8: Reports by Dev Customer
async function createDevCustomerReports() {
  console.log("📋 Creating reports by dev customer...")

  const reportData = [
    {
      type: "PAYMENT_ISSUE",
      topic: "Delayed Booking Confirmation",
      description:
        "Payment was processed, but booking confirmation took too long.",
      status: "PENDING",
      adminId: null,
    },
    {
      type: "COURSE_ISSUE",
      topic: "Inconsistent Course Duration",
      description:
        "The actual session was shorter than the advertised duration.",
      status: "DONE",
      adminId: DEV_ADMIN_ID,
    },
    {
      type: "WEBSITE_ISSUE",
      topic: "Profile Image Upload Failure",
      description: "Unable to upload profile image due to persistent error.",
      status: "DISCARD",
      adminId: DEV_ADMIN_ID,
    },
  ]

  for (const report of reportData) {
    await prisma.report.create({
      data: {
        id: generateShortId("rep"),
        customerId: DEV_CUSTOMER_ID,
        adminId: report.adminId,
        reportType: report.type as any,
        topic: report.topic,
        description: report.description,
        reportStatus: report.status as any,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
  }

  console.log("✅ Reports by dev customer created")
}

// Step 9: Reports Resolved by Dev Admin
async function createDevAdminReports() {
  console.log("📋 Creating reports resolved by dev admin...")

  // Fetch other customers to use as report creators
  const otherCustomers = await prisma.customer.findMany({
    where: { id: { not: DEV_CUSTOMER_ID } },
    take: 5,
  })

  const reportData = [
    {
      customer: otherCustomers[0],
      type: "PROPHET_ISSUE",
      topic: "Unprofessional Prophet Behavior",
      description:
        "The prophet was late and seemed unprepared for the session.",
      status: "DONE",
    },
    {
      customer: otherCustomers[1],
      type: "WEBSITE_ISSUE",
      topic: "Payment System Malfunction",
      description: "Website crashed during checkout process.",
      status: "DISCARD",
    },
    {
      customer: otherCustomers[2],
      type: "COURSE_ISSUE",
      topic: "Misleading Course Description",
      description: "Course content did not match the advertised description.",
      status: "PENDING",
    },
  ]

  for (const report of reportData) {
    await prisma.report.create({
      data: {
        id: generateShortId("arep"),
        customerId: report.customer.id,
        adminId: DEV_ADMIN_ID,
        reportType: report.type as any,
        topic: report.topic,
        description: report.description,
        reportStatus: report.status as any,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
  }

  console.log("✅ Reports resolved by dev admin created")
}

// Step 10: Create specific 4 bookings between dev_customer and dev_prophet
// 2 SCHEDULED, 1 UPCOMING, 1 COMPLETED
async function createDevCustomerDevProphetBookings() {
  console.log(
    "📅 Creating 4 specific bookings between dev_customer and dev_prophet..."
  )

  const now = new Date()

  // Fetch dev prophet's active courses
  const devProphetCourses = await prisma.course.findMany({
    where: {
      prophetId: DEV_PROPHET_ID,
      isActive: true,
    },
  })

  if (devProphetCourses.length === 0) {
    console.log("Dev prophet has no active courses. Skipping.")
    return
  }

  // Fetch dev prophet's available slots
  const devProphetAvailabilities = await prisma.prophetAvailability.findMany({
    where: {
      prophetId: DEV_PROPHET_ID,
      date: { gte: now },
    },
    orderBy: {
      startTime: "asc",
    },
    take: 20, // Get enough slots
  })

  if (devProphetAvailabilities.length < 4) {
    console.log("Not enough availability slots. Skipping.")
    return
  }

  // Convert to Date objects
  const availableSlots = devProphetAvailabilities.map(slot => {
    const startDateTime = new Date(slot.date)
    startDateTime.setHours(
      slot.startTime.getHours(),
      slot.startTime.getMinutes(),
      slot.startTime.getSeconds()
    )
    return startDateTime
  })

  const bookedSlots = new Set<string>()

  // Booking 1: COMPLETED (past booking)
  const course1 = devProphetCourses[0]
  const completedStart = new Date(now.getTime() - 24 * 60 * 60 * 1000) // 24 hours ago
  const completedEnd = new Date(
    completedStart.getTime() + course1.durationMin * 60 * 1000
  )

  await prisma.booking.create({
    data: {
      id: generateShortId("devbk"),
      customerId: DEV_CUSTOMER_ID,
      courseId: course1.id,
      prophetId: DEV_PROPHET_ID,
      startDateTime: completedStart,
      endDateTime: completedEnd,
      status: "COMPLETED",
      createdAt: new Date(now.getTime() - 25 * 60 * 60 * 1000),
    },
  })

  await prisma.transaction.create({
    data: {
      id: generateShortId("devtx"),
      bookingId: (await prisma.booking.findFirst({
        where: {
          customerId: DEV_CUSTOMER_ID,
          prophetId: DEV_PROPHET_ID,
          status: "COMPLETED",
        },
        select: { id: true },
      }))!.id,
      status: "PAID_OUT",
      amount: course1.price,
      createdAt: new Date(now.getTime() - 25 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
    },
  })

  // Booking 2: SCHEDULED (future booking)
  const course2 = devProphetCourses[devProphetCourses.length > 1 ? 1 : 0]
  const scheduledStart = availableSlots[0]
  const scheduledEnd = new Date(
    scheduledStart.getTime() + course2.durationMin * 60 * 1000
  )

  await prisma.booking.create({
    data: {
      id: generateShortId("devbk"),
      customerId: DEV_CUSTOMER_ID,
      courseId: course2.id,
      prophetId: DEV_PROPHET_ID,
      startDateTime: scheduledStart,
      endDateTime: scheduledEnd,
      status: "SCHEDULED",
      createdAt: new Date(),
    },
  })

  const booking2 = await prisma.booking.findFirst({
    where: {
      customerId: DEV_CUSTOMER_ID,
      prophetId: DEV_PROPHET_ID,
      status: "SCHEDULED",
    },
    select: { id: true },
  })

  await prisma.transaction.create({
    data: {
      id: generateShortId("devtx"),
      bookingId: booking2!.id,
      status: "PENDING_PAYOUT",
      amount: course2.price,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })

  // Booking 3: SCHEDULED (another future booking)
  const course3 = devProphetCourses[Math.min(2, devProphetCourses.length - 1)]
  const scheduled2Start = availableSlots[1]
  const scheduled2End = new Date(
    scheduled2Start.getTime() + course3.durationMin * 60 * 1000
  )

  await prisma.booking.create({
    data: {
      id: generateShortId("devbk"),
      customerId: DEV_CUSTOMER_ID,
      courseId: course3.id,
      prophetId: DEV_PROPHET_ID,
      startDateTime: scheduled2Start,
      endDateTime: scheduled2End,
      status: "SCHEDULED",
      createdAt: new Date(),
    },
  })

  const booking3 = await prisma.booking.findFirst({
    where: {
      customerId: DEV_CUSTOMER_ID,
      prophetId: DEV_PROPHET_ID,
      status: "SCHEDULED",
      startDateTime: scheduled2Start,
    },
    select: { id: true },
  })

  await prisma.transaction.create({
    data: {
      id: generateShortId("devtx"),
      bookingId: booking3!.id,
      status: "PENDING_PAYOUT",
      amount: course3.price,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })

  // Booking 4: UPCOMING/FUTURE (next available booking)
  const course4 = devProphetCourses[Math.min(3, devProphetCourses.length - 1)]
  const upcomingStart = availableSlots[2]
  const upcomingEnd = new Date(
    upcomingStart.getTime() + course4.durationMin * 60 * 1000
  )

  await prisma.booking.create({
    data: {
      id: generateShortId("devbk"),
      customerId: DEV_CUSTOMER_ID,
      courseId: course4.id,
      prophetId: DEV_PROPHET_ID,
      startDateTime: upcomingStart,
      endDateTime: upcomingEnd,
      status: "SCHEDULED",
      createdAt: new Date(),
    },
  })

  const booking4 = await prisma.booking.findFirst({
    where: {
      customerId: DEV_CUSTOMER_ID,
      prophetId: DEV_PROPHET_ID,
      status: "SCHEDULED",
      startDateTime: upcomingStart,
    },
    select: { id: true },
  })

  await prisma.transaction.create({
    data: {
      id: generateShortId("devtx"),
      bookingId: booking4!.id,
      status: "PENDING_PAYOUT",
      amount: course4.price,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })

  console.log(
    "✅ 4 bookings between dev_customer and dev_prophet created (1 COMPLETED, 3 SCHEDULED)"
  )
}

// Main Seeding Function
async function seedDevData() {
  try {
    console.log("🌱 Starting dev data seeding...")

    await createDevAccounts()
    await createDevProphetMethods()
    await createDevProphetAvailabilities()
    await createDevProphetCourses()
    await createDevProphetTransactionAccounts()
    await createDevCustomerBookings()
    await createOtherCustomersDevProphetBookings()
    await createDevCustomerDevProphetBookings()
    await createDevCustomerReports()
    await createDevAdminReports()

    console.log("✅ Dev data seeding completed!")
  } catch (error) {
    console.error("❌ Dev data seeding failed:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Execute Seeding
seedDevData()
