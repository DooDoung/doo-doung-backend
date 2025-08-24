import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prisma = new PrismaClient();

const dataDir = path.join(__dirname, '..', 'mock_data/csv_output');

async function parseCSV(fileName: string): Promise<any[]> {
  const results: any[] = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(fileName)
      .pipe(csv())
      .on('data', (data: any) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err: Error) => reject(err));
  });
}

// ===== DATE FORMAT CONVERTER =====
class DateFormatConverter {
  /**
   * Convert various date string formats to JavaScript Date object
   * Handles ISO strings, date-only strings, and validates the result
   */
  static convertToDate(dateString: string | null | undefined): Date | null {
    if (!dateString || dateString === '' || dateString === 'null' || dateString === 'None') {
      return null;
    }

    try {
      let processedDate: string = dateString.toString().trim();

      // Handle date-only format (YYYY-MM-DD) - convert to full ISO string
      if (/^\d{4}-\d{2}-\d{2}$/.test(processedDate)) {
        processedDate = `${processedDate}T00:00:00.000Z`;
      }
      
      // Handle datetime without timezone (YYYY-MM-DDTHH:mm:ss.sss)
      else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}$/.test(processedDate)) {
        processedDate = `${processedDate}Z`;
      }
      
      // Handle datetime without milliseconds (YYYY-MM-DDTHH:mm:ss)
      else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(processedDate)) {
        processedDate = `${processedDate}.000Z`;
      }

      const date = new Date(processedDate);
      
      // Validate the date
      if (isNaN(date.getTime())) {
        console.warn(`Invalid date string: "${dateString}" - using current date as fallback`);
        return new Date();
      }

      return date;
    } catch (error) {
      console.warn(`Error parsing date "${dateString}":`, error);
      return new Date(); // Fallback to current date
    }
  }

  /**
   * Convert time string to Date object (for time-only fields)
   * Uses epoch date (1970-01-01) as base
   */
  static convertTimeToDate(timeString: string | null | undefined): Date | null {
    if (!timeString || timeString === '' || timeString === 'null' || timeString === 'None') {
      return null;
    }

    try {
      // If it's already a full ISO string, use it directly
      if (timeString.includes('T') && timeString.includes('Z')) {
        return this.convertToDate(timeString);
      }

      // If it's just time (HH:mm:ss), combine with epoch date
      if (/^\d{2}:\d{2}:\d{2}$/.test(timeString)) {
        const epochDate = `1970-01-01T${timeString}.000Z`;
        return new Date(epochDate);
      }

      // Fallback - try to parse as regular date
      return this.convertToDate(timeString);
    } catch (error) {
      console.warn(`Error parsing time "${timeString}":`, error);
      return new Date(`1970-01-01T09:00:00.000Z`); // 9 AM fallback
    }
  }

  /**
   * Get current timestamp as Date object
   */
  static getCurrentDate(): Date {
    return new Date();
  }

  /**
   * Validate and format date for logging
   */
  static formatForLog(date: Date | null): string {
    if (!date) return 'null';
    return date.toISOString();
  }
}

// Helper function to convert string values to proper types
function convertRecord(record: any, tableName: string): any {
  const converted = { ...record };
  
  // ===== DATE/TIME FIELD CONVERSION =====
  // Define DateTime fields for each table
  const dateTimeFields = {
    account: ['createdAt', 'updatedAt'],
    userDetail: ['createdAt', 'updatedAt'],
    customer: ['birthDate', 'birthTime', 'createdAt', 'updatedAt'],
    prophet: ['createdAt', 'updatedAt'],
    admin: ['createdAt', 'updatedAt'],
    horoscopeMethod: [],
    prophetMethod: [],
    prophetAvailability: ['date', 'startTime', 'endTime', 'createdAt', 'updatedAt'],
    course: ['createdAt', 'updatedAt'],
    booking: ['startDate', 'endDate', 'createdAt'],
    transaction: ['timestamp', 'createdAt', 'updatedAt'],
    transactionAccount: ['createdAt', 'updatedAt'],
    review: ['createdAt', 'updatedAt'],
    report: ['createdAt', 'updatedAt']
  };

  // Convert DateTime fields
  const fieldsToConvert = dateTimeFields[tableName as keyof typeof dateTimeFields] || [];
  fieldsToConvert.forEach(field => {
    if (converted[field]) {
      // Special handling for time fields
      if (['birthTime', 'startTime', 'endTime'].includes(field)) {
        converted[field] = DateFormatConverter.convertTimeToDate(converted[field]);
      } else {
        converted[field] = DateFormatConverter.convertToDate(converted[field]);
      }
      
      // Log conversion for debugging
      console.log(`Converted ${tableName}.${field}: ${record[field]} → ${DateFormatConverter.formatForLog(converted[field])}`);
    }
  });

  // ===== BOOLEAN CONVERSION =====
  if (converted.isActive === 'True') converted.isActive = true;
  if (converted.isActive === 'False') converted.isActive = false;
  
  // ===== NUMERIC CONVERSION =====
  const numericFields = ['id', 'score', 'durationMin', 'horoscopeMethodId', 'methodId'];
  numericFields.forEach(field => {
    if (converted[field] && !isNaN(Number(converted[field]))) {
      converted[field] = Number(converted[field]);
    }
  });
  
  // ===== DECIMAL CONVERSION =====
  if (converted.price) {
    converted.price = parseFloat(converted.price);
  }
  
  // ===== NULL VALUE HANDLING =====
  Object.keys(converted).forEach(key => {
    if (converted[key] === '' || converted[key] === 'None') {
      converted[key] = null;
    }
  });
  
  return converted;
}

// Helper function to validate foreign key references
async function validateForeignKeys(record: any, tableName: string): Promise<boolean> {
  try {
    switch (tableName) {
      case 'userDetail':
        if (record.accountId) {
          const account = await prisma.account.findUnique({ where: { id: record.accountId } });
          if (!account) {
            console.log(`⚠️  Invalid accountId for userDetail: ${record.accountId}`);
            return false;
          }
        }
        break;
        
      case 'customer':
        if (record.accountId) {
          const account = await prisma.account.findUnique({ where: { id: record.accountId } });
          if (!account) {
            console.log(`⚠️  Invalid accountId for customer: ${record.accountId}`);
            return false;
          }
        }
        break;
        
      case 'prophet':
        if (record.accountId) {
          const account = await prisma.account.findUnique({ where: { id: record.accountId } });
          if (!account) {
            console.log(`⚠️  Invalid accountId for prophet: ${record.accountId}`);
            return false;
          }
        }
        break;
        
      case 'admin':
        if (record.accountId) {
          const account = await prisma.account.findUnique({ where: { id: record.accountId } });
          if (!account) {
            console.log(`⚠️  Invalid accountId for admin: ${record.accountId}`);
            return false;
          }
        }
        break;
        
      case 'prophetMethod':
        if (record.prophetId) {
          const prophet = await prisma.prophet.findUnique({ where: { id: record.prophetId } });
          if (!prophet) {
            console.log(`⚠️  Invalid prophetId for prophetMethod: ${record.prophetId}`);
            return false;
          }
        }
        if (record.methodId) {
          const method = await prisma.horoscopeMethod.findUnique({ where: { id: parseInt(record.methodId) } });
          if (!method) {
            console.log(`⚠️  Invalid methodId for prophetMethod: ${record.methodId}`);
            return false;
          }
        }
        break;
        
      case 'prophetAvailability':
        if (record.prophetId) {
          const prophet = await prisma.prophet.findUnique({ where: { id: record.prophetId } });
          if (!prophet) {
            console.log(`⚠️  Invalid prophetId for prophetAvailability: ${record.prophetId}`);
            return false;
          }
        }
        break;
        
      case 'course':
        if (record.prophetId) {
          const prophet = await prisma.prophet.findUnique({ where: { id: record.prophetId } });
          if (!prophet) {
            console.log(`⚠️  Invalid prophetId for course: ${record.prophetId}`);
            return false;
          }
        }
        if (record.horoscopeMethodId) {
          const method = await prisma.horoscopeMethod.findUnique({ where: { id: parseInt(record.horoscopeMethodId) } });
          if (!method) {
            console.log(`⚠️  Invalid horoscopeMethodId for course: ${record.horoscopeMethodId}`);
            return false;
          }
        }
        break;
        
      case 'booking':
        if (record.customerId) {
          const customer = await prisma.customer.findUnique({ where: { id: record.customerId } });
          if (!customer) {
            console.log(`⚠️  Invalid customerId for booking: ${record.customerId}`);
            return false;
          }
        }
        if (record.courseId) {
          const course = await prisma.course.findUnique({ where: { id: record.courseId } });
          if (!course) {
            console.log(`⚠️  Invalid courseId for booking: ${record.courseId}`);
            return false;
          }
        }
        break;
        
      case 'transaction':
        if (record.bookingId) {
          const booking = await prisma.booking.findUnique({ where: { id: record.bookingId } });
          if (!booking) {
            console.log(`⚠️  Invalid bookingId for transaction: ${record.bookingId}`);
            return false;
          }
        }
        break;
        
      case 'transactionAccount':
        if (record.prophetId) {
          const prophet = await prisma.prophet.findUnique({ where: { id: record.prophetId } });
          if (!prophet) {
            console.log(`⚠️  Invalid prophetId for transactionAccount: ${record.prophetId}`);
            return false;
          }
        }
        break;
        
      case 'review':
        if (record.customerId) {
          const customer = await prisma.customer.findUnique({ where: { id: record.customerId } });
          if (!customer) {
            console.log(`⚠️  Invalid customerId for review: ${record.customerId}`);
            return false;
          }
        }
        if (record.bookingId) {
          const booking = await prisma.booking.findUnique({ where: { id: record.bookingId } });
          if (!booking) {
            console.log(`⚠️  Invalid bookingId for review: ${record.bookingId}`);
            return false;
          }
        }
        if (record.courseId) {
          const course = await prisma.course.findUnique({ where: { id: record.courseId } });
          if (!course) {
            console.log(`⚠️  Invalid courseId for review: ${record.courseId}`);
            return false;
          }
        }
        break;
        
      case 'report':
        if (record.customerId) {
          const customer = await prisma.customer.findUnique({ where: { id: record.customerId } });
          if (!customer) {
            console.log(`⚠️  Invalid customerId for report: ${record.customerId}`);
            return false;
          }
        }
        if (record.adminId) {
          const admin = await prisma.admin.findUnique({ where: { id: record.adminId } });
          if (!admin) {
            console.log(`⚠️  Invalid adminId for report: ${record.adminId}`);
            return false;
          }
        }
        break;
    }
    return true;
  } catch (error) {
    console.error(`❌ Foreign key validation error for ${tableName}:`, error);
    return false;
  }
}

async function seedTable(tableName: string): Promise<void> {
  console.log(`\n🌱 Seeding table: ${tableName}`);

  const mappingTable: { [key: string]: string } = {
    "account": "accounts",
    "userDetail": "user_details", 
    "customer": "customers",
    "prophet": "prophets",
    "prophetAvailability": "prophet_availabilities",
    "horoscopeMethod": "horoscope_methods",
    "prophetMethod": "prophet_methods",
    "course": "courses",
    "booking": "bookings",
    "transaction": "transactions",
    "transactionAccount": "transaction_accounts",
    "review": "reviews",
    "admin": "admins",
    "report": "reports"
  };

  const filePath = path.join(dataDir, `${mappingTable[tableName]}.csv`);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ CSV file not found for table "${tableName}": ${filePath}`);
    return;
  }

  const records = await parseCSV(filePath);
  console.log(`📊 Found ${records.length} records for ${tableName}`);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    try {
      console.log(`\n🔄 Processing ${tableName} record ${i + 1}/${records.length}`);
      
      const converted = convertRecord(record, tableName);
      const isValid = await validateForeignKeys(converted, tableName);
      
      if (isValid) {
        switch (tableName) {
          case 'account':
            await prisma.account.create({ data: converted });
            break;
          case 'userDetail':
            await prisma.userDetail.create({ data: converted });
            break;
          case 'customer':
            await prisma.customer.create({ data: converted });
            break;
          case 'prophet':
            await prisma.prophet.create({ data: converted });
            break;
          case 'prophetAvailability':
            await prisma.prophetAvailability.create({ data: converted });
            break;
          case 'horoscopeMethod':
            await prisma.horoscopeMethod.create({ data: converted });
            break;
          case 'prophetMethod':
            await prisma.prophetMethod.create({ data: converted });
            break;
          case 'course':
            await prisma.course.create({ data: converted });
            break;
          case 'booking':
            await prisma.booking.create({ data: converted });
            break;
          case 'transaction':
            await prisma.transaction.create({ data: converted });
            break;
          case 'transactionAccount':
            await prisma.transactionAccount.create({ data: converted });
            break;
          case 'review':
            await prisma.review.create({ data: converted });
            break;
          case 'admin':
            await prisma.admin.create({ data: converted });
            break;
          case 'report':
            await prisma.report.create({ data: converted });
            break;
          default:
            console.error(`❌ Unknown table: ${tableName}`);
            return;
        }
        successCount++;
        console.log(`✅ Successfully created ${tableName} record ${i + 1}`);
      } else {
        skipCount++;
        console.log(`⚠️  Skipped ${tableName} record ${i + 1} (invalid foreign keys)`);
      }
    } catch (error: any) {
      errorCount++;
      console.error(`❌ Error processing ${tableName} record ${i + 1}:`, error.message);
      console.error('Problematic record:', record);
    }
  }

  console.log(`\n✅ Finished seeding ${tableName}:`);
  console.log(`   📈 Success: ${successCount}`);
  console.log(`   ⚠️  Skipped: ${skipCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
}

async function clearAllTables() {
  console.log('🧹 Clearing existing data...');
  
  // Delete in reverse order to respect foreign key constraints
  const clearOrder = [
    'report',
    'review', 
    'transactionAccount',
    'transaction',
    'booking',
    'course',
    'prophetAvailability',
    'prophetMethod',
    'horoscopeMethod',
    'admin',
    'prophet',
    'customer',
    'userDetail',
    'account'
  ];

  for (const tableName of clearOrder) {
    try {
      switch (tableName) {
        case 'account':
          await prisma.account.deleteMany();
          break;
        case 'userDetail':
          await prisma.userDetail.deleteMany();
          break;
        case 'customer':
          await prisma.customer.deleteMany();
          break;
        case 'prophet':
          await prisma.prophet.deleteMany();
          break;
        case 'admin':
          await prisma.admin.deleteMany();
          break;
        case 'horoscopeMethod':
          await prisma.horoscopeMethod.deleteMany();
          break;
        case 'prophetMethod':
          await prisma.prophetMethod.deleteMany();
          break;
        case 'prophetAvailability':
          await prisma.prophetAvailability.deleteMany();
          break;
        case 'course':
          await prisma.course.deleteMany();
          break;
        case 'booking':
          await prisma.booking.deleteMany();
          break;
        case 'transaction':
          await prisma.transaction.deleteMany();
          break;
        case 'transactionAccount':
          await prisma.transactionAccount.deleteMany();
          break;
        case 'review':
          await prisma.review.deleteMany();
          break;
        case 'report':
          await prisma.report.deleteMany();
          break;
      }
      console.log(`🗑️  Cleared ${tableName}`);
    } catch (error: any) {
      console.log(`⚠️  Could not clear ${tableName}: ${error.message}`);
    }
  }
}

async function main() {
  const tableToSeed = process.argv[2]?.toLowerCase();
  const shouldClear = process.argv.includes('--clear') || !tableToSeed;

  console.log('🚀 Starting database seeding process...');
  console.log(`📅 Current time: ${DateFormatConverter.getCurrentDate().toISOString()}`);

  if (shouldClear) {
    await clearAllTables();
  }

  if (tableToSeed) {
    await seedTable(tableToSeed);
  } else {
    console.log('No table specified, seeding all tables...');
    // List tables in the order respecting FK constraints
    const tables = [
      'account',
      'userDetail',
      'customer', 
      'prophet',
      'admin',
      'horoscopeMethod',
      'prophetMethod',
      'prophetAvailability',
      'course',
      'booking',
      'transaction',
      'transactionAccount',
      'review',
      'report',
    ];

    for (const table of tables) {
      try {
        await seedTable(table);
      } catch (error) {
        console.error(`❌ Error seeding ${table}:`, error);
        // Continue with next table instead of stopping
      }
    }
  }
}

main()
  .catch(e => {
    console.error('💥 Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('🔌 Database connection closed');
  });