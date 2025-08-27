// Development data seeding functions for comprehensive testing
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

// Helper function to generate short IDs
function generateShortId(prefix: string, counter: number): string {
  return `d_${prefix}_${counter.toString().padStart(3, '0')}`
}

async function seedDevAccounts() {
  console.log('🛠️ Seeding development accounts...')
  
  // Dev Customer Account
  const devCustomerAccountId = 'dev_customer_001'
  const devCustomerAccount = await prisma.account.upsert({
    where: { username: 'dev_customer' },
    update: {},
    create: {
      id: devCustomerAccountId,
      email: 'dev_customer@gmail.com',
      username: 'dev_customer',
      passwordHash: await bcrypt.hash('dev_password', 10),
      role: 'CUSTOMER',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  // Dev Customer User Detail
  await prisma.userDetail.upsert({
    where: { accountId: devCustomerAccountId },
    update: {},
    create: {
      accountId: devCustomerAccountId,
      name: 'Dev',
      lastname: 'Customer',
      profileUrl: 'https://example.com/profile/dev_customer.jpg',
      phoneNumber: '+66812345678',
      gender: 'UNDEFINED',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  // Dev Customer Profile
  await prisma.customer.upsert({
    where: { accountId: devCustomerAccountId },
    update: {},
    create: {
      id: devCustomerAccountId,
      accountId: devCustomerAccountId,
      birthDate: new Date('1990-01-01'),
      birthTime: new Date('1970-01-01T12:00:00.000Z'),
      zodiacSign: 'AQUARIUS',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  // Dev Prophet Account
  const devProphetAccountId = 'dev_prophet_001'
  const devProphetAccount = await prisma.account.upsert({
    where: { username: 'dev_prophet' },
    update: {},
    create: {
      id: devProphetAccountId,
      email: 'dev_prophet@gmail.com',
      username: 'dev_prophet',
      passwordHash: await bcrypt.hash('dev_password', 10),
      role: 'PROPHET',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  // Dev Prophet User Detail
  await prisma.userDetail.upsert({
    where: { accountId: devProphetAccountId },
    update: {},
    create: {
      accountId: devProphetAccountId,
      name: 'Dev',
      lastname: 'Prophet',
      profileUrl: 'https://example.com/profile/dev_prophet.jpg',
      phoneNumber: '+66812345679',
      gender: 'UNDEFINED',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  // Dev Prophet Profile
  await prisma.prophet.upsert({
    where: { accountId: devProphetAccountId },
    update: {},
    create: {
      id: devProphetAccountId,
      accountId: devProphetAccountId,
      lineId: 'dev_prophet_line',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  // Dev Admin Account
  const devAdminAccountId = 'dev_admin_001'
  const devAdminAccount = await prisma.account.upsert({
    where: { username: 'dev_admin' },
    update: {},
    create: {
      id: devAdminAccountId,
      email: 'dev_admin@gmail.com',
      username: 'dev_admin',
      passwordHash: await bcrypt.hash('dev_password', 10),
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  // Dev Admin User Detail
  await prisma.userDetail.upsert({
    where: { accountId: devAdminAccountId },
    update: {},
    create: {
      accountId: devAdminAccountId,
      name: 'Dev',
      lastname: 'Admin',
      profileUrl: 'https://example.com/profile/dev_admin.jpg',
      phoneNumber: '+66812345680',
      gender: 'UNDEFINED',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  // Dev Admin Profile
  await prisma.admin.upsert({
    where: { accountId: devAdminAccountId },
    update: {},
    create: {
      id: devAdminAccountId,
      accountId: devAdminAccountId,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  console.log('✅ Development accounts seeded')
}

async function seedDevRelatedData() {
  console.log('🛠️ Seeding development related data...')
  
  const DEV_CUSTOMER_ID = 'dev_customer_001'
  const DEV_PROPHET_ID = 'dev_prophet_001'
  const DEV_ADMIN_ID = 'dev_admin_001'

  // 1. Prophet Methods for Dev Prophet
  console.log('📚 Seeding prophet methods for dev prophet...')
  const availableMethods = await prisma.horoscopeMethod.findMany()
  
  // Assign multiple methods to dev prophet
  for (let i = 0; i < Math.min(5, availableMethods.length); i++) {
    await prisma.prophetMethod.upsert({
      where: {
        prophetId_methodId: {
          prophetId: DEV_PROPHET_ID,
          methodId: availableMethods[i].id
        }
      },
      update: {},
      create: {
        prophetId: DEV_PROPHET_ID,
        methodId: availableMethods[i].id
      }
    })
  }

  // 2. Prophet Availabilities for Dev Prophet
  console.log('📅 Seeding prophet availabilities for dev prophet...')
  const today = new Date()
  
  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const date = new Date(today)
    date.setDate(today.getDate() + dayOffset)
    
    // Morning slot
    await prisma.prophetAvailability.upsert({
      where: {
        prophetId_date_startTime_endTime: {
          prophetId: DEV_PROPHET_ID,
          date: date,
          startTime: new Date('1970-01-01T09:00:00.000Z'),
          endTime: new Date('1970-01-01T12:00:00.000Z')
        }
      },
      update: {},
      create: {
        prophetId: DEV_PROPHET_ID,
        date: date,
        startTime: new Date('1970-01-01T09:00:00.000Z'),
        endTime: new Date('1970-01-01T12:00:00.000Z'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    // Afternoon slot (skip weekends for some variety)
    if (dayOffset % 7 < 5) {
      await prisma.prophetAvailability.upsert({
        where: {
          prophetId_date_startTime_endTime: {
            prophetId: DEV_PROPHET_ID,
            date: date,
            startTime: new Date('1970-01-01T14:00:00.000Z'),
            endTime: new Date('1970-01-01T18:00:00.000Z')
          }
        },
        update: {},
        create: {
          prophetId: DEV_PROPHET_ID,
          date: date,
          startTime: new Date('1970-01-01T14:00:00.000Z'),
          endTime: new Date('1970-01-01T18:00:00.000Z'),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    }

    // Evening slot (every 3 days)
    if (dayOffset % 3 === 0) {
      await prisma.prophetAvailability.upsert({
        where: {
          prophetId_date_startTime_endTime: {
            prophetId: DEV_PROPHET_ID,
            date: date,
            startTime: new Date('1970-01-01T19:00:00.000Z'),
            endTime: new Date('1970-01-01T21:00:00.000Z')
          }
        },
        update: {},
        create: {
          prophetId: DEV_PROPHET_ID,
          date: date,
          startTime: new Date('1970-01-01T19:00:00.000Z'),
          endTime: new Date('1970-01-01T21:00:00.000Z'),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    }
  }

  // 3. Courses for Dev Prophet
  console.log('📖 Seeding courses for dev prophet...')
  const devProphetMethods = await prisma.prophetMethod.findMany({
    where: { prophetId: DEV_PROPHET_ID },
    include: { method: true }
  })

  const coursesData = [
    { name: 'Basic Tarot Reading', sector: 'LOVE', duration: 30, price: 500.00 },
    { name: 'Advanced Astrology Chart', sector: 'WORK', duration: 60, price: 1200.00 },
    { name: 'Premium Palm Reading', sector: 'MONEY', duration: 45, price: 800.00 },
    { name: 'Crystal Ball Consultation', sector: 'FAMILY', duration: 90, price: 1500.00 },
    { name: 'Numerology Life Path', sector: 'LUCK', duration: 60, price: 1000.00 }
  ]

  for (let i = 0; i < coursesData.length && i < devProphetMethods.length; i++) {
    const course = coursesData[i]
    const method = devProphetMethods[i]
    
    await prisma.course.upsert({
      where: { id: generateShortId('course', i + 1) },
      update: {},
      create: {
        id: generateShortId('course', i + 1),
        prophetId: DEV_PROPHET_ID,
        courseName: course.name,
        horoscopeMethodId: method.methodId,
        horoscopeSector: course.sector as any,
        durationMin: course.duration,
        price: course.price,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
  }

  // 4. Transaction Accounts for Dev Prophet
  console.log('💳 Seeding transaction accounts for dev prophet...')
  const bankAccounts = [
    { bank: 'KBANK', accountName: 'Dev Prophet', accountNumber: '1234567890' },
    { bank: 'SCB', accountName: 'Dev Prophet 2', accountNumber: '0987654321' }
  ]

  for (let i = 0; i < bankAccounts.length; i++) {
    const account = bankAccounts[i]
    await prisma.transactionAccount.upsert({
      where: {
        prophetId_bank_accountNumber: {
          prophetId: DEV_PROPHET_ID,
          bank: account.bank as any,
          accountNumber: account.accountNumber
        }
      },
      update: {},
      create: {
        id: generateShortId('txaccount', i + 1),
        prophetId: DEV_PROPHET_ID,
        accountName: account.accountName,
        accountNumber: account.accountNumber,
        bank: account.bank as any,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
  }

  // 5. Bookings - Dev Customer with Other Prophets
  console.log('📝 Seeding bookings for dev customer with other prophets...')
  const otherProphets = await prisma.prophet.findMany({
    where: { id: { not: DEV_PROPHET_ID } },
    take: 3
  })

  for (let i = 0; i < otherProphets.length; i++) {
    const prophet = otherProphets[i]
    const courses = await prisma.course.findMany({
      where: { prophetId: prophet.id, isActive: true },
      take: 1
    })
    
    if (courses.length > 0) {
      const course = courses[0]
      const bookingDate = new Date()
      bookingDate.setDate(today.getDate() + i + 1)
      bookingDate.setHours(10, 0, 0, 0)
      
      const endDate = new Date(bookingDate)
      endDate.setMinutes(bookingDate.getMinutes() + course.durationMin)
      
      const bookingId = generateShortId('booking', i + 1)
      
      await prisma.booking.upsert({
        where: { id: bookingId },
        update: {},
        create: {
          id: bookingId,
          customerId: DEV_CUSTOMER_ID,
          courseId: course.id,
          prophetId: prophet.id,
          startDateTime: bookingDate,
          endDateTime: endDate,
          status: i === 0 ? 'COMPLETED' : (i === 1 ? 'SCHEDULED' : 'FAILED'),
          createdAt: new Date()
        }
      })

      // Create transaction for this booking
      await prisma.transaction.upsert({
        where: { bookingId: bookingId },
        update: {},
        create: {
          id: generateShortId('transact', i + 1),
          bookingId: bookingId,
          status: i === 0 ? 'COMPLETED' : (i === 1 ? 'PROCESSING' : 'FAILED'),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })

      // Create review for completed booking
      if (i === 0) {
        await prisma.review.upsert({
          where: { bookingId: bookingId },
          update: {},
          create: {
            id: generateShortId('review', i + 1),
            customerId: DEV_CUSTOMER_ID,
            bookingId: bookingId,
            score: 5,
            description: 'Excellent reading! Very insightful and accurate. The prophet was professional and provided detailed explanations.',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
      }
    }
  }

  // 6. Bookings - Other Customers with Dev Prophet
  console.log('📝 Seeding bookings for other customers with dev prophet...')
  const otherCustomers = await prisma.customer.findMany({
    where: { id: { not: DEV_CUSTOMER_ID } },
    take: 5
  })

  const devCourses = await prisma.course.findMany({
    where: { prophetId: DEV_PROPHET_ID, isActive: true }
  })

  for (let i = 0; i < Math.min(otherCustomers.length, devCourses.length); i++) {
    const customer = otherCustomers[i]
    const course = devCourses[i]
    const bookingDate = new Date()
    bookingDate.setDate(today.getDate() + i + 10)
    bookingDate.setHours(14 + i, 0, 0, 0)
    
    const endDate = new Date(bookingDate)
    endDate.setMinutes(bookingDate.getMinutes() + course.durationMin)
    
    await prisma.booking.upsert({
      where: {
        prophetId_startDateTime_endDateTime: {
          prophetId: DEV_PROPHET_ID,
          startDateTime: bookingDate,
          endDateTime: endDate,
        },
      },
      update: {},
      create: {
        id: generateShortId('devbooking', i + 1),
        customerId: customer.id,
        courseId: course.id,
        prophetId: DEV_PROPHET_ID,
        startDateTime: bookingDate,
        endDateTime: endDate,
        status: i < 2 ? 'COMPLETED' : (i < 4 ? 'SCHEDULED' : 'FAILED'),
        createdAt: new Date()
      }
    })

    // Create transaction for this booking
    await prisma.transaction.upsert({
      where: { bookingId: generateShortId('devbooking', i + 1) },
      update: {},
      create: {
        id: generateShortId('dtransact', i + 1),
        bookingId: generateShortId('devbooking', i + 1),
        status: i < 2 ? 'COMPLETED' : (i < 4 ? 'PROCESSING' : 'FAILED'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    // Create reviews for completed bookings
    if (i < 2) {
      const reviews = [
        { score: 5, description: 'Outstanding service! The dev prophet provided incredibly detailed insights.' },
        { score: 4, description: 'Very good reading, though could use more time for follow-up questions.' }
      ]
      
      await prisma.review.upsert({
        where: { bookingId: generateShortId('devbooking', i + 1) },
        update: {},
        create: {
          id: generateShortId('dreview', i + 1),
          customerId: customer.id,
          bookingId: generateShortId('devbooking', i + 1),
          score: reviews[i].score,
          description: reviews[i].description,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    }
  }

  // 7. Reports - Dev Customer Reports
  console.log('📋 Seeding reports from dev customer...')
  const reportData = [
    {
      type: 'PAYMENT_ISSUE',
      topic: 'Payment Processing Delay',
      description: 'Payment was successful but booking confirmation took too long to appear in my account.',
      status: 'DONE',
      adminId: DEV_ADMIN_ID
    },
    {
      type: 'COURSE_ISSUE', 
      topic: 'Course Duration Mismatch',
      description: 'The actual session was shorter than the advertised duration. Expected 60 minutes but got 45.',
      status: 'PENDING',
      adminId: null
    },
    {
      type: 'WEBSITE_ISSUE',
      topic: 'Profile Image Upload Failed',
      description: 'Cannot upload profile image. Gets error message every time I try.',
      status: 'DISCARD',
      adminId: DEV_ADMIN_ID
    }
  ]

  for (let i = 0; i < reportData.length; i++) {
    const report = reportData[i]
    await prisma.report.upsert({
      where: { id: generateShortId('report', i + 1) },
      update: {},
      create: {
        id: generateShortId('report', i + 1),
        customerId: DEV_CUSTOMER_ID,
        adminId: report.adminId,
        reportType: report.type as any,
        topic: report.topic,
        description: report.description,
        reportStatus: report.status as any,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
  }

  // 8. Reports - Other Customers to Dev Admin
  console.log('📋 Seeding reports handled by dev admin...')
  const adminReportsData = [
    {
      type: 'PROPHET_ISSUE',
      topic: 'Prophet was unprofessional during session',
      description: 'The prophet arrived late and seemed unprepared for the session. Very disappointing experience.',
      status: 'DONE',
      adminId: DEV_ADMIN_ID
    },
    {
      type: 'WEBSITE_ISSUE', 
      topic: 'Website crashed during checkout',
      description: 'The website kept freezing when I tried to complete payment. Lost my booking slot.',
      status: 'DISCARD',
      adminId: DEV_ADMIN_ID
    },
    {
      type: 'OTHER',
      topic: 'General inquiry about refund policy',
      description: 'I would like to understand the refund policy for cancelled bookings.',
      status: 'PENDING',
      adminId: null
    },
    {
      type: 'COURSE_ISSUE',
      topic: 'Course content not as advertised',
      description: 'The course description mentioned detailed life guidance but session was very generic.',
      status: 'PENDING',
      adminId: null
    }
  ]

  for (let i = 0; i < Math.min(adminReportsData.length, otherCustomers.length); i++) {
    const customer = otherCustomers[i]
    const report = adminReportsData[i]
    
    await prisma.report.upsert({
      where: { id: generateShortId('report', i + 1) },
      update: {},
      create: {
        id: generateShortId('report', i + 1),
        customerId: customer.id,
        adminId: report.adminId,
        reportType: report.type as any,
        topic: report.topic,
        description: report.description,
        reportStatus: report.status as any,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
  }

  console.log('✅ Development related data seeded successfully')
}

// Main function to seed all dev accounts and related data
async function seedCompleteDevData() {
  try {
    // First seed the basic dev accounts
    await seedDevAccounts()
    
    // Then seed all related data
    await seedDevRelatedData()
    
    console.log('🎉 Complete development data seeding finished!')
  } catch (error) {
    console.error('❌ Error during development data seeding:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedCompleteDevData()
