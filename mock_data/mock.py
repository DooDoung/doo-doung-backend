import csv
import random
from faker import Faker
from datetime import datetime, timedelta, timezone, time
from decimal import Decimal
from pathlib import Path

fake = Faker()
output_dir = Path("./csv_output")
output_dir.mkdir(exist_ok=True)

# ENUMS
SEX = ['Male', 'Female', 'LGBTQ_Plus', 'Undefined']
HOROSCOPE_SECTORS = ['love', 'work', 'study', 'money', 'luck', 'family']
BOOKING_STATUSES = ['SCHEDULED', 'COMPLETED', 'FAILED']
TRANSACTION_STATUSES = ['PROCESSING', 'COMPLETED', 'FAILED']
REPORT_TYPES = ['Course_issue', 'Prophet_issue', 'Payment_issue', 'Website_issue', 'Other']
REPORT_STATUSES = ['PENDING', 'FIXING', 'DONE']
ZODIAC_SIGNS = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces']
BANKS = ['BBL', 'KTB', 'KBANK', 'SCB', 'BAY', 'TTB', 'CIMB', 'UOB', 'GSB', 'BAAC']
ROLES = ['prophet', 'customer', 'admin']

# Helpers
def short_id():
    return fake.uuid4()[:16]

def iso_datetime(dt=None):
    """Return clean ISO-8601 DateTime string"""
    if dt is None:
        dt = datetime.now(timezone.utc)
    elif isinstance(dt, str):
        return dt
    elif isinstance(dt, datetime):
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        # Return clean ISO format: 2025-08-23T15:30:45.123Z
        return dt.isoformat().replace('+00:00', 'Z')
    raise ValueError("Expected datetime.datetime object for ISO formatting")

def random_datetime_today():
    """Generate a random datetime for today"""
    base_date = datetime.now(timezone.utc).date()
    random_hour = random.randint(8, 20)
    random_minute = random.choice([0, 15, 30, 45])
    return datetime.combine(base_date, time(random_hour, random_minute), tzinfo=timezone.utc)

def save_csv(name, data):
    if not data:
        print(f"Warning: No data to save for {name}")
        return
    with open(output_dir / f"{name}.csv", "w", newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=data[0].keys())
        writer.writeheader()
        writer.writerows(data)

now = datetime.now(timezone.utc)

# Accounts
print("Generating Accounts...")
used_emails = set()
used_usernames = set()
accounts = []

for role in (["customer"] * 100 + ["prophet"] * 50 + ["admin"] * 10):
    while True:
        email = fake.email()
        if email not in used_emails:
            used_emails.add(email)
            break
    while True:
        username = fake.user_name()
        if username not in used_usernames:
            used_usernames.add(username)
            break
    accounts.append({
        "id": short_id(),
        "email": email,
        "username": username,
        "passwordHash": fake.sha256(),
        "role": role,
        "createdAt": iso_datetime(now),
        "updatedAt": iso_datetime(now)
    })

save_csv("accounts", accounts)

# UserDetails
print("Generating UserDetails...")
user_details = [{
    "id": i + 1,
    "accountId": acc["id"],
    "name": fake.first_name(),
    "lastname": fake.last_name(),
    "profileUrl": fake.image_url(),
    "phoneNumber": fake.phone_number()[:20],
    "gender": random.choice(SEX),
    "createdAt": iso_datetime(now),
    "updatedAt": iso_datetime(now)
} for i, acc in enumerate(accounts)]
save_csv("user_details", user_details)

# Role splits
customers_accounts = [acc for acc in accounts if acc["role"] == "customer"]
prophets_accounts = [acc for acc in accounts if acc["role"] == "prophet"]
admins_accounts = [acc for acc in accounts if acc["role"] == "admin"]

# Customers
print("Generating Customers...")
customer_rows = [{
    "id": short_id(),
    "accountId": acc["id"],
    "birthDate": iso_datetime(datetime.combine(fake.date_of_birth(minimum_age=18, maximum_age=70), datetime.min.time(), tzinfo=timezone.utc)),
    "birthTime": iso_datetime(random_datetime_today()),  # Full datetime for time field
    "zodiacSign": random.choice(ZODIAC_SIGNS),
    "createdAt": iso_datetime(now),
    "updatedAt": iso_datetime(now)
} for acc in customers_accounts]
save_csv("customers", customer_rows)

# Prophets
print("Generating Prophets...")
prophet_rows = [{
    "id": short_id(),
    "accountId": acc["id"],
    "lineId": fake.user_name()[:50],
    "createdAt": iso_datetime(now),
    "updatedAt": iso_datetime(now)
} for acc in prophets_accounts]
save_csv("prophets", prophet_rows)

# Admins
print("Generating Admins...")
admin_rows = [{
    "id": short_id(),
    "accountId": acc["id"],
    "createdAt": iso_datetime(now),
    "updatedAt": iso_datetime(now)
} for acc in admins_accounts]
save_csv("admins", admin_rows)

# HoroscopeMethods
print("Generating HoroscopeMethods...")
method_rows = [{
    "id": i + 1,
    "slug": fake.slug()[:50],
    "name": f"{fake.word().capitalize()} method"[:100]
} for i in range(10)]
save_csv("horoscope_methods", method_rows)

# ProphetMethods
print("Generating ProphetMethods...")
prophet_method_rows = []
used_combinations = set()
for prophet in prophet_rows:
    num_methods = random.randint(1, min(3, len(method_rows)))
    selected_methods = random.sample(method_rows, num_methods)
    for method in selected_methods:
        combination = (prophet["id"], method["id"])
        if combination not in used_combinations:
            used_combinations.add(combination)
            prophet_method_rows.append({
                "prophetId": prophet["id"],
                "methodId": method["id"]
            })
save_csv("prophet_methods", prophet_method_rows)

# ProphetAvailabilities
print("Generating ProphetAvailabilities...")
availability_rows = []
for i in range(min(50, len(prophet_rows) * 5)):
    # Generate start and end times as full datetimes
    start_hour = random.randint(8, 16)  # Start between 8 AM and 4 PM
    end_hour = start_hour + random.randint(2, 8)  # 2-8 hours later
    end_hour = min(end_hour, 22)  # Don't go past 10 PM
    
    base_date = fake.date_this_year()
    start_datetime = datetime.combine(base_date, time(start_hour, 0), tzinfo=timezone.utc)
    end_datetime = datetime.combine(base_date, time(end_hour, 0), tzinfo=timezone.utc)
    
    availability_rows.append({
        "id": i + 1,
        "prophetId": random.choice(prophet_rows)["id"],
        "date": iso_datetime(datetime.combine(base_date, datetime.min.time(), tzinfo=timezone.utc)),
        "startTime": iso_datetime(start_datetime),  # Full datetime
        "endTime": iso_datetime(end_datetime),      # Full datetime
        "createdAt": iso_datetime(now),
        "updatedAt": iso_datetime(now)
    })
save_csv("prophet_availabilities", availability_rows)

# Courses
print("Generating Courses...")
course_rows = []
for _ in range(min(150, len(prophet_rows) * 10)):
    prophet = random.choice(prophet_rows)
    method = random.choice(method_rows)
    course_rows.append({
        "id": short_id(),
        "prophetId": prophet["id"],
        "courseName": fake.catch_phrase()[:200],
        "horoscopeMethodId": method["id"],
        "horoscopeSector": random.choice(HOROSCOPE_SECTORS),
        "durationMin": random.choice([30, 45, 60]),
        "price": float(round(Decimal(random.uniform(300, 999)), 2)),
        "isActive": random.choice([True, True, False]),
        "createdAt": iso_datetime(now),
        "updatedAt": iso_datetime(now)
    })
save_csv("courses", course_rows)

# Bookings
print("Generating Bookings...")
booking_rows = []
active_courses = [c for c in course_rows if c["isActive"]]
for i in range(min(100, len(customer_rows) * 2)):
    if not active_courses:
        break
    course = random.choice(active_courses)
    customer = random.choice(customer_rows)
    start_time = fake.date_time_between(start_date='-2M', end_date='+1M')
    if start_time.tzinfo is None:
        start_time = start_time.replace(tzinfo=timezone.utc)
    end_time = start_time + timedelta(minutes=course["durationMin"])
    booking_rows.append({
        "id": short_id(),
        "customerId": customer["id"],
        "courseId": course["id"],
        "startDate": iso_datetime(start_time),
        "endDate": iso_datetime(end_time),
        "createdAt": iso_datetime(now),
        "status": random.choice(BOOKING_STATUSES)
    })
save_csv("bookings", booking_rows)

# Transactions
print("Generating Transactions...")
transaction_rows = []
sample_size = min(80, len(booking_rows))
for booking in random.sample(booking_rows, sample_size):
    transaction_rows.append({
        "id": short_id(),
        "bookingId": booking["id"],
        "timestamp": iso_datetime(now),
        "status": random.choice(TRANSACTION_STATUSES),
        "createdAt": iso_datetime(now),
        "updatedAt": iso_datetime(now)
    })
save_csv("transactions", transaction_rows)

# TransactionAccounts
print("Generating TransactionAccounts...")
tx_account_rows = []
sample_size = min(40, len(prophet_rows))
for prophet in random.sample(prophet_rows, sample_size):
    tx_account_rows.append({
        "id": short_id(),
        "prophetId": prophet["id"],
        "accountName": fake.name()[:100],
        "accountNumber": fake.bban()[:50],
        "bank": random.choice(BANKS),
        "createdAt": iso_datetime(now),
        "updatedAt": iso_datetime(now)
    })
save_csv("transaction_accounts", tx_account_rows)

# Reviews
print("Generating Reviews...")
review_rows = []
completed_bookings = [b for b in booking_rows if b["status"] == "COMPLETED"]
available_bookings = completed_bookings if completed_bookings else booking_rows
sample_size = min(70, len(available_bookings))
for booking in random.sample(available_bookings, sample_size):
    review_rows.append({
        "id": short_id(),
        "customerId": booking["customerId"],
        "bookingId": booking["id"],
        "score": random.randint(1, 5),
        "description": fake.sentence()[:500],
        "createdAt": iso_datetime(now),
        "updatedAt": iso_datetime(now),
        "courseId": booking["courseId"]
    })
save_csv("reviews", review_rows)

# Reports
print("Generating Reports...")
report_rows = []
for _ in range(50):
    customer = random.choice(customer_rows)
    admin = random.choice(admin_rows) if random.random() > 0.3 and admin_rows else None
    report_rows.append({
        "id": short_id(),
        "customerId": customer["id"],
        "adminId": admin["id"] if admin else None,
        "reportType": random.choice(REPORT_TYPES),
        "topic": fake.bs()[:200],
        "description": fake.text(max_nb_chars=500),
        "reportStatus": random.choice(REPORT_STATUSES),
        "createdAt": iso_datetime(now),
        "updatedAt": iso_datetime(now)
    })
save_csv("reports", report_rows)

print("\n✅ CSV files generated successfully!")
print(f"Generated files in {output_dir}:")
for csv_file in sorted(output_dir.glob("*.csv")):
    with open(csv_file, 'r', encoding='utf-8') as f:
        line_count = sum(1 for _ in f) - 1
    print(f"  - {csv_file.name}: {line_count} records")

print("\n📝 IMPORTANT: When importing to Prisma, convert DateTime strings to Date objects:")
print("Example: new Date(record.birthTime) for DateTime fields")