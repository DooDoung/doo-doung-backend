from collections import defaultdict
import csv
import random
import string
import uuid
from datetime import datetime, timedelta, timezone, time
from decimal import Decimal
import os

# Output directory setup
output_dir = "./csv_output"
os.makedirs(output_dir, exist_ok=True)

# ENUMS - EXACTLY MATCHING PRISMA SCHEMA
SEX = ['MALE', 'FEMALE', 'LGBTQ_PLUS', 'UNDEFINED']
HOROSCOPE_SECTORS = ['LOVE', 'WORK', 'STUDY', 'MONEY', 'LUCK', 'FAMILY']
BOOKING_STATUSES = ['SCHEDULED', 'COMPLETED', 'FAILED']
TRANSACTION_STATUSES = ['PROCESSING', 'COMPLETED', 'FAILED']
REPORT_TYPES = ['COURSE_ISSUE', 'PROPHET_ISSUE', 'PAYMENT_ISSUE', 'WEBSITE_ISSUE', 'OTHER']
REPORT_STATUSES = ['DISCARD', 'DONE']
ZODIAC_SIGNS = ['ARIES', 'TAURUS', 'GEMINI', 'CANCER', 'LEO', 'VIRGO', 'LIBRA', 'SCORPIO', 'SAGITTARIUS', 'CAPRICORN', 'AQUARIUS', 'PISCES']
BANKS = ['BBL', 'KTB', 'KBANK', 'SCB', 'BAY', 'TTB', 'CIMB', 'UOB', 'GSB', 'BAAC']
ROLES = ['PROPHET', 'CUSTOMER', 'ADMIN']

# Names for consistent generation
FIRST_NAMES = ["John", "Jane", "Alice", "Bob", "Charlie", "Emma", "David", "Sarah", 
               "Michael", "Emily", "Daniel", "Olivia", "James", "Sophia", "William", "Isabella"]
LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", 
              "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson"]

def short_id():
    """Generate a 16-character UUID"""
    return str(uuid.uuid4()).replace('-', '')[:16]

def random_email(used_emails=None, base_username=""):
    """Generate a unique email address"""
    if used_emails is None:
        used_emails = set()
    
    # Use base_username if provided for more uniqueness
    if base_username:
        base = base_username.lower()
    else:
        base = ''.join(random.choices(string.ascii_lowercase, k=6))
    
    attempts = 0
    while attempts < 100:
        suffix = ''.join(random.choices(string.digits, k=4))
        domain_part = ''.join(random.choices(string.ascii_lowercase, k=5))
        email = f"{base}{suffix}@{domain_part}.com"
        
        if email not in used_emails:
            used_emails.add(email)
            return email
        attempts += 1
    
    # Fallback with timestamp if all attempts fail
    timestamp = str(int(datetime.now().timestamp() * 1000000))
    return f"user{timestamp}@example.com"

def random_name():
    return random.choice(FIRST_NAMES), random.choice(LAST_NAMES)

def save_csv(filename, data):
    """Save data to a CSV file"""
    if not data:
        print(f"Warning: No data to save for {filename}")
        return
    
    filepath = os.path.join(output_dir, f"{filename}.csv")
    with open(filepath, "w", newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=data[0].keys())
        writer.writeheader()
        writer.writerows(data)
    
    print(f"Saved {len(data)} records to {filepath}")

now = datetime.now(timezone.utc)

def generate_accounts():
    accounts = []
    used_emails = set()
    used_usernames = set()

    for i, role in enumerate(["CUSTOMER"] * 100 + ["PROPHET"] * 50 + ["ADMIN"] * 10):
        base_username = f"{role.lower()}{i}"
        email = random_email(used_emails, base_username)
        
        # Generate unique username
        username = base_username
        counter = 1
        while username in used_usernames:
            username = f"{base_username}_{counter}"
            counter += 1
        
        used_usernames.add(username)
        used_emails.add(email)
        
        accounts.append({
            "id": short_id(),
            "email": email,
            "username": username,
            "password_hash": ''.join(random.choices(string.hexdigits.lower(), k=60)),
            "role": role,
            "created_at": now.isoformat(),
            "updated_at": now.isoformat()
        })

    return accounts

def generate_horoscope_methods():
    method_names = [
        "Tarot Reading", "Astrology Chart", "Palm Reading", "Crystal Ball", 
        "Numerology", "Dream Analysis", "Rune Casting", "Tea Leaf Reading",
        "Pendulum Divination", "Aura Reading"
    ]

    return [
        {
            "id": i + 1,  # Explicitly set auto-increment ID
            "slug": name.lower().replace(' ', '_').replace('-', '_'),
            "name": name
        } for i, name in enumerate(method_names)
    ]

def generate_user_details(accounts):
    user_details = []
    for acc in accounts:
        first, last = random_name()
        user_details.append({
            "account_id": acc["id"],
            "name": first,
            "lastname": last,
            "profile_url": f"https://example.com/profile/{short_id()}.jpg",
            "phone_number": f"+66{random.randint(100000000, 999999999)}",
            "gender": random.choice(SEX),
            "created_at": now.isoformat(),
            "updated_at": now.isoformat()
        })
    return user_details

def generate_customers(customer_accounts):
    customers = []
    for acc in customer_accounts:
        birth_date = datetime(random.randint(1950, 2005), random.randint(1, 12), random.randint(1, 28))
        birth_time = datetime.combine(datetime.today(), time(random.randint(0, 23), random.randint(0, 59)))
        
        customers.append({
            "id": short_id(),
            "account_id": acc["id"],
            "birth_date": birth_date.date().isoformat(),
            "birth_time": birth_time.time().strftime("%H:%M:%S"),
            "zodiac_sign": random.choice(ZODIAC_SIGNS),
            "created_at": now.isoformat(),
            "updated_at": now.isoformat(),
            "is_public": random.choice([True, False]),
        })
    return customers

def generate_prophets(prophet_accounts):
    prophets = []
    for acc in prophet_accounts:
        prophets.append({
            "id": short_id(),
            "account_id": acc["id"],
            "line_id": ''.join(random.choices(string.ascii_lowercase + string.digits, k=20)),
            "created_at": now.isoformat(),
            "updated_at": now.isoformat()
        })
    return prophets

def generate_prophet_methods(prophets, horoscope_methods):
    prophet_methods = []
    for prophet in prophets:
        num_methods = random.randint(1, 3)
        selected_methods = random.sample(horoscope_methods, min(num_methods, len(horoscope_methods)))
        
        # No explicit ID for this table, as it uses a composite primary key
        prophet_methods.extend([
            {
                "prophet_id": prophet["id"],
                "method_id": method["id"]
            } for method in selected_methods
        ])
    
    return prophet_methods

def generate_prophet_availabilities(prophets):
    prophet_availabilities = []
    
    for prophet in prophets:
        # Track used dates and slots for this prophet
        used_dates = set()
        
        # Generate availabilities for next 30 days
        for day_offset in range(0, 30, random.randint(1, 3)):
            date = datetime.now().date() + timedelta(days=day_offset)
            
            # Skip if this date has already been used for this prophet
            if date in used_dates:
                continue
            
            # Randomly decide number of slots (1-3)
            num_slots = random.randint(1, 3)
            
            # Sort slots to ensure no overlap
            possible_slots = [(h, m) for h in range(7, 23) for m in [0, 15, 30, 45]]
            random.shuffle(possible_slots)
            
            # Track used slots for this date
            used_slots = set()
            
            for hour, minute in possible_slots:
                if len(used_slots) >= num_slots:
                    break
                
                start_time = time(hour, minute)
                
                # Ensure no overlap with existing slots
                if any((s[0] == start_time.hour and s[1] == start_time.minute) for s in used_slots):
                    continue
                
                # Add this slot
                prophet_availabilities.append({
                    "prophet_id": prophet["id"],
                    "date": date.isoformat(),
                    "start_time": start_time.strftime("%H:%M:%S"),
                    "created_at": now.isoformat()
                })
                
                used_slots.add((start_time.hour, start_time.minute))
            
            # Mark this date as used
            used_dates.add(date)

    return prophet_availabilities

def generate_courses(prophets, horoscope_methods):
    courses = []
    for prophet in prophets:
        prophet_method_ids = [pm["method_id"] for pm in generate_prophet_methods([prophet], horoscope_methods)]
        
        if not prophet_method_ids:
            method = random.choice(horoscope_methods)
            prophet_method_ids = [method["id"]]
        
        num_courses = random.randint(1, 3)
        for _ in range(num_courses):
            method_id = random.choice(prophet_method_ids)
            method_name = next(m["name"] for m in horoscope_methods if m["id"] == method_id)
            
            courses.append({
                "id": short_id(),
                "prophet_id": prophet["id"],
                "course_name": f"{random.choice(['Basic', 'Advanced', 'Premium', 'Deluxe'])} {method_name} Session",
                "horoscope_method_id": method_id,
                "horoscope_sector": random.choice(HOROSCOPE_SECTORS),
                "duration_min": random.choice([30, 45, 60, 90]),
                "price": f"{random.uniform(300, 2000):.2f}",
                "is_active": random.choice([True, True, True, False]),
                "created_at": now.isoformat(),
                "updated_at": now.isoformat()
            })

    return courses

def generate_bookings(customers, active_courses, prophet_availabilities):
    bookings = []
    used_booking_slots = set()
    availabilities_by_prophet = defaultdict(list)
    for slot in prophet_availabilities:
        slot_date = datetime.strptime(slot["date"], "%Y-%m-%d").date()
        slot_start_time = datetime.strptime(slot["start_time"], "%H:%M:%S").time()
        
        start_datetime = datetime.combine(slot_date, slot_start_time)
        availabilities_by_prophet[slot["prophet_id"]].append(start_datetime)

    # Sort the slots
    for prophet_id in availabilities_by_prophet:
        availabilities_by_prophet[prophet_id].sort()

    for customer in customers:
        num_bookings = random.randint(0, 2)
        
        for _ in range(num_bookings):
            if not active_courses:
                break
                
            attempts = 0
            booking_created = False
            while attempts < 50 and not booking_created:
                attempts += 1 # Increment attempts
                
                course = random.choice(active_courses)
                prophet_id = course["prophet_id"]
                course_duration = int(course["duration_min"])
                
                # 2. Calculate how many 15-minute slots are required
                if course_duration <= 0 or course_duration % 15 != 0:
                    continue # Skip if course duration isn't a positive multiple of 15
                
                slots_needed = course_duration // 15
                
                prophet_slots = availabilities_by_prophet.get(prophet_id, [])
                
                if len(prophet_slots) < slots_needed:
                    continue

                # Create a list of possible starting indices and shuffle them for randomness
                possible_start_indices = list(range(len(prophet_slots) - slots_needed + 1))
                random.shuffle(possible_start_indices)

                # 3. Find a valid sequence of consecutive, unused slots
                for i in possible_start_indices:
                    potential_slots = prophet_slots[i : i + slots_needed]
                    
                    # Check if any of these slots are already booked
                    is_used = any((prophet_id, s) in used_booking_slots for s in potential_slots)
                    if is_used:
                        continue

                    # Check if the slots are consecutive (15 mins apart)
                    is_consecutive = True
                    for j in range(len(potential_slots) - 1):
                        time_diff = potential_slots[j+1] - potential_slots[j]
                        if time_diff != timedelta(minutes=15):
                            is_consecutive = False
                            break
                    
                    if is_consecutive:
                        # Found a valid slot sequence!
                        start_datetime = potential_slots[0]
                        end_datetime = potential_slots[-1] + timedelta(minutes=15)
                        
                        # 4. Mark all individual slots in the sequence as used
                        for s in potential_slots:
                            used_booking_slots.add((prophet_id, s))
                            
                        bookings.append({
                            "id": short_id(), 
                            "customer_id": customer["id"],
                            "course_id": course["id"],
                            "prophet_id": prophet_id,
                            "start_datetime": start_datetime.isoformat(),
                            "end_datetime": end_datetime.isoformat(),
                            "status": random.choice(BOOKING_STATUSES),
                            "created_at": now.isoformat()
                        })
                        
                        booking_created = True
                        break # Exit the loop for start_indices
            
    return bookings

def generate_transactions(bookings):
    transactions = []
    for booking in bookings:
        transactions.append({
            "id": short_id(),
            "booking_id": booking["id"],
            "status": random.choice(TRANSACTION_STATUSES),
            "created_at": now.isoformat(),
            "updated_at": now.isoformat()
        })

    return transactions

def generate_transaction_accounts(prophets):
    transaction_accounts = []
    used_account_combinations = set()

    for prophet in prophets:
        num_accounts = random.randint(1, 2)
        
        for _ in range(num_accounts):
            attempts = 0
            while attempts < 20:
                first, last = random_name()
                bank = random.choice(BANKS)
                account_number = ''.join(random.choices(string.digits, k=random.randint(10, 12)))
                
                combo_key = (prophet["id"], bank, account_number)
                
                if combo_key not in used_account_combinations:
                    used_account_combinations.add(combo_key)
                    
                    transaction_accounts.append({
                        "id": short_id(),
                        "prophet_id": prophet["id"],
                        "account_name": f"{first} {last}",
                        "account_number": account_number,
                        "bank": bank,
                        "created_at": now.isoformat(),
                        "updated_at": now.isoformat()
                    })
                    break
                attempts += 1

    return transaction_accounts

def generate_reviews(completed_bookings):
    reviews = []
    for booking in completed_bookings:
        if random.random() < 0.8:
            reviews.append({
                "id": short_id(),
                "customer_id": booking["customer_id"],
                "booking_id": booking["id"],
                "score": random.randint(3, 5),
                "description": random.choice([
                    "Amazing reading! Very insightful and accurate.",
                    "Great experience, highly recommend this prophet.",
                    "Professional service and detailed explanations.",
                    "Wonderful session, helped me understand many things.",
                    "Excellent guidance and spiritual insight.",
                    ""  # Empty string instead of None for CSV compatibility
                ]) if random.random() < 0.7 else "",
                "created_at": now.isoformat(),
                "updated_at": now.isoformat()
            })

    return reviews

def generate_reports(customers, admins):
    reports = []
    for customer in customers:
        if random.random() < 0.2:
            num_reports = random.randint(1, 2)
            for _ in range(num_reports):
                admin = random.choice(admins) if random.random() < 0.7 and admins else None
                
                reports.append({
                    "id": short_id(),
                    "customer_id": customer["id"],
                    "admin_id": admin["id"] if admin else "",  # Empty string instead of None
                    "report_type": random.choice(REPORT_TYPES),
                    "topic": random.choice([
                        "Booking Issue", "Payment Problem", "Technical Error",
                        "Service Quality", "Prophet Behavior", "Website Bug"
                    ]),
                    "description": random.choice([
                        "Had trouble with the booking system.",
                        "Payment was processed but booking wasn't confirmed.",
                        "Prophet was late for the session.",
                        "Website crashed during payment.",
                        "Received poor quality service.",
                        "Technical issues during the session."
                    ]),
                    "report_status": random.choice(REPORT_STATUSES) if admin else "PENDING",
                    "created_at": now.isoformat(),
                    "updated_at": now.isoformat()
                })

    return reports

def main():
    # Generate base data
    accounts = generate_accounts()
    save_csv("accounts", accounts)

    # Generate horoscope methods first (for referencing)
    horoscope_methods = generate_horoscope_methods()
    save_csv("horoscope_methods", horoscope_methods)

    # User Details with explicit auto-increment ID
    user_details = generate_user_details(accounts)
    save_csv("user_details", user_details)

    # Customers (only from CUSTOMER accounts)
    customer_accounts = [a for a in accounts if a["role"] == "CUSTOMER"]
    customers = generate_customers(customer_accounts)
    save_csv("customers", customers)

    # Prophets (only from PROPHET accounts)
    prophet_accounts = [a for a in accounts if a["role"] == "PROPHET"]
    prophets = generate_prophets(prophet_accounts)
    save_csv("prophets", prophets)

    # Admins (only from ADMIN accounts)
    admins = [a for a in accounts if a["role"] == "ADMIN"]

    # Prophet Methods
    prophet_methods = generate_prophet_methods(prophets, horoscope_methods)
    save_csv("prophet_methods", prophet_methods)

    # Prophet Availabilities with explicit auto-increment ID
    prophet_availabilities = generate_prophet_availabilities(prophets)
    save_csv("prophet_availabilities", prophet_availabilities)

    # Courses
    courses = generate_courses(prophets, horoscope_methods)
    save_csv("courses", courses)

    # Active courses for booking generation
    active_courses = [c for c in courses if c["is_active"]]

    # Bookings
    bookings = generate_bookings(customers, active_courses, prophet_availabilities)
    save_csv("bookings", bookings)

    # Transactions
    transactions = generate_transactions(bookings)
    save_csv("transactions", transactions)

    # Transaction Accounts
    transaction_accounts = generate_transaction_accounts(prophets)
    save_csv("transaction_accounts", transaction_accounts)

    # Reviews (only for completed bookings)
    completed_bookings = [b for b in bookings if b["status"] == "COMPLETED"]
    reviews = generate_reviews(completed_bookings)
    save_csv("reviews", reviews)

    # Reports
    reports = generate_reports(customers, admins)
    save_csv("reports", reports)

    print("\n✅ Complete mock CSV files generated successfully in csv_output directory!")
    print("\nGenerated Tables:")

    # Show statistics
    total_records = 0
    for filename in sorted(os.listdir(output_dir)):
        if filename.endswith('.csv'):
            with open(os.path.join(output_dir, filename), 'r', encoding='utf-8') as f:
                line_count = sum(1 for _ in f) - 1
            print(f"  - {filename}: {line_count} records")
            total_records += line_count

    print(f"\nTotal records generated: {total_records}")

    # Show relationship summary
    print(f"\nRelationship Summary:")
    print(f"  - Accounts: {len(accounts)}")
    print(f"    - Customers: {len(customers)}")
    print(f"    - Prophets: {len(prophets)}")
    print(f"    - Admins: {len(admins)}")
    print(f"  - Active Courses: {len(active_courses)}")
    print(f"  - Bookings: {len(bookings)}")
    print(f"    - Completed: {len([b for b in bookings if b['status'] == 'COMPLETED'])}")
    print(f"  - Reviews: {len(reviews)}")
    print(f"  - Reports: {len(reports)}")

if __name__ == "__main__":
    main()