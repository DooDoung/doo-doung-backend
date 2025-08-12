-- Enums
CREATE TYPE sex AS ENUM ('Male', 'Female', 'LGBTQ+', 'Undefined');

CREATE TYPE method AS ENUM ('Tarot_reading', 'Palmistry', 'Thai_zodiac', 'Physiognomy');

CREATE TYPE horoscope AS ENUM ('Love', 'Work', 'Study', 'Money', 'Luck');

CREATE TYPE statusType AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

CREATE TYPE reportType AS ENUM ('Course_issue', 'Prophet_issue', 'Payment_issue', 'Website_issue', 'Other');

CREATE TYPE reportStatus AS ENUM ('PENDING', 'FIXING', 'DONE');

-- Tables

CREATE TABLE account (
  id VARCHAR(16) PRIMARY KEY,
  username VARCHAR(16) NOT NULL,
  password VARCHAR(45) NOT NULL
);

CREATE TABLE user_detail (
  id VARCHAR(16) PRIMARY KEY,
  account_id VARCHAR(16) NOT NULL UNIQUE REFERENCES account(id) ON DELETE CASCADE,
  name VARCHAR(45) NOT NULL,
  lastname VARCHAR(45) NOT NULL,
  gender sex,
  phone_number CHAR(10),
  email VARCHAR(45) NOT NULL
);

CREATE TABLE customer (
  id VARCHAR(16) PRIMARY KEY,
  account_id VARCHAR(16) NOT NULL REFERENCES account(id) ON DELETE CASCADE,
  birth_date DATE NOT NULL,
  birth_time TIME NOT NULL,
  zodiac_sign VARCHAR(11) NOT NULL
);

CREATE TABLE prophet (
  id VARCHAR(16) PRIMARY KEY,
  account_id VARCHAR(16) NOT NULL REFERENCES account(id) ON DELETE CASCADE,
  line_id VARCHAR(30)
);

CREATE TABLE transaction_account (
  id VARCHAR(16) PRIMARY KEY,
  prophet_id VARCHAR(16) NOT NULL REFERENCES prophet(id) ON DELETE CASCADE,
  account_name VARCHAR(45) NOT NULL,
  account_number CHAR(10) NOT NULL,
  bank VARCHAR(45) NOT NULL
);

CREATE TABLE prophet_method (
  id VARCHAR(16) PRIMARY KEY,
  prophet_id VARCHAR(16) NOT NULL REFERENCES prophet(id) ON DELETE CASCADE,
  method method NOT NULL
);

CREATE TABLE course (
  id VARCHAR(16) PRIMARY KEY,
  prophet_id VARCHAR(16) NOT NULL REFERENCES prophet(id) ON DELETE CASCADE,
  course_name VARCHAR(100) NOT NULL,
  method method NOT NULL,
  horoscope_sector horoscope NOT NULL,
  price NUMERIC(7,2) CHECK (price >= 0.00 AND price <= 99999.00) NOT NULL
);

CREATE TABLE ordert (
  id VARCHAR(16) PRIMARY KEY,
  customer_id VARCHAR(16) NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status statusType NOT NULL
);

CREATE TABLE transactiont (
  id VARCHAR(16) PRIMARY KEY,
  order_id VARCHAR(16) NOT NULL REFERENCES ordert(id) ON DELETE CASCADE,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status statusType NOT NULL
);

CREATE TABLE review (
  id VARCHAR(16) PRIMARY KEY,
  customer_id VARCHAR(16) NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
  course_id VARCHAR(16) NOT NULL REFERENCES course(id) ON DELETE CASCADE,
  score INT CHECK (score >= 0 AND score <= 5),
  description VARCHAR(255)
);

CREATE TABLE course_order (
  course_id VARCHAR(16) NOT NULL REFERENCES course(id) ON DELETE CASCADE,
  order_id VARCHAR(16) NOT NULL REFERENCES ordert(id) ON DELETE CASCADE,
  PRIMARY KEY (course_id, order_id)
);

CREATE TABLE admint (
  id VARCHAR(16) PRIMARY KEY,
  account_id VARCHAR(16) NOT NULL REFERENCES account(id) ON DELETE CASCADE
);

CREATE TABLE report (
  id VARCHAR(16) PRIMARY KEY,
  customer_id VARCHAR(16) NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
  admin_id VARCHAR(16) REFERENCES admint(id) ON DELETE SET NULL,
  report_type reportType NOT NULL,
  description VARCHAR(255),
  report_status reportStatus NOT NULL
);
