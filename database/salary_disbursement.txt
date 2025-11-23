-- Create Database
CREATE DATABASE academic_erp;
USE academic_erp;

-- ==============================
-- TABLE: departments
-- ==============================
CREATE TABLE departments (
    department_id INT PRIMARY KEY,
    name VARCHAR(255),
    capacity INT
);

-- Insert Department Data
INSERT INTO departments (department_id, name, capacity) VALUES
(1, 'Admissions', 10),
(2, 'Accounts', 10),
(3, 'Faculty', 50),
(4, 'Placement Incharge', 5),
(5, 'IT & Infrastructure', 10);

-- ==============================
-- TABLE: employees
-- ==============================
CREATE TABLE employees (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255),
    photograph_path VARCHAR(500),
    department INT,
    FOREIGN KEY (department)
        REFERENCES departments(department_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- Insert Employee Data
INSERT INTO employees (first_name, last_name, email, title, photograph_path, department) VALUES
-- Admissions (2)
('Aman', 'Verma', 'aman.verma@example.com', 'Admission Officer', 'photos/aman.jpg', 1),
('Riya', 'Sharma', 'riya.sharma@example.com', 'Admission Coordinator', 'photos/riya.jpg', 1),

-- Accounts (3)
('Karan', 'Mehta', 'karan.mehta@example.com', 'Senior Accountant', 'photos/karan.jpg', 2),
('Neha', 'Agarwal', 'neha.agarwal@example.com', 'Accounts Clerk', 'photos/neha.jpg', 2),
('Manoj', 'Singh', 'manoj.singh@example.com', 'Billing Specialist', 'photos/manoj.jpg', 2),

-- Faculty (10)
('Aniket', 'Patil', 'aniket.patil@example.com', 'Professor - CSE', 'photos/aniket.jpg', 3),
('Sonal', 'Rao', 'sonal.rao@example.com', 'Assistant Professor - IT', 'photos/sonal.jpg', 3),
('Vikas', 'Kulkarni', 'vikas.kulkarni@example.com', 'Dean Academics', 'photos/vikas.jpg', 3),
('Divya', 'Chauhan', 'divya.chauhan@example.com', 'Research Associate', 'photos/divya.jpg', 3),
('Rahul', 'Yadav', 'rahul.yadav@example.com', 'Professor - Mechanical', 'photos/rahul.jpg', 3),
('Meera', 'Joshi', 'meera.joshi@example.com', 'Lecturer - Physics', 'photos/meera.jpg', 3),
('Prakash', 'Nair', 'prakash.nair@example.com', 'Professor - Maths', 'photos/prakash.jpg', 3),
('Sana', 'Iqbal', 'sana.iqbal@example.com', 'Assistant Lecturer - Chemistry', 'photos/sana.jpg', 3),
('Rohan', 'Bose', 'rohan.bose@example.com', 'Lab Instructor - CSE', 'photos/rohan.jpg', 3),
('Sneha', 'Pillai', 'sneha.pillai@example.com', 'Faculty Assistant', 'photos/sneha.jpg', 3),

-- Placement Incharge (2)
('Pooja', 'Deshmukh', 'pooja.deshmukh@example.com', 'Placement Coordinator', 'photos/pooja.jpg', 4),
('Harsh', 'Gupta', 'harsh.gupta@example.com', 'Placement Officer', 'photos/harsh.jpg', 4),

-- IT & Infrastructure (3)
('Nikhil', 'Sinha', 'nikhil.sinha@example.com', 'Network Engineer', 'photos/nikhil.jpg', 5),
('Shruti', 'Menon', 'shruti.menon@example.com', 'System Administrator', 'photos/shruti.jpg', 5),
('Arjun', 'Kapoor', 'arjun.kapoor@example.com', 'Software Developer', 'photos/arjun.jpg', 5);

-- ==============================
-- TABLE: employee_salary
-- ==============================
CREATE TABLE employee_salary (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description VARCHAR(500),
    status ENUM('PENDING', 'DISBURSED') DEFAULT 'PENDING',
    disbursed_by INT,
    disbursed_at DATETIME,
    updated_by INT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
    FOREIGN KEY (disbursed_by) REFERENCES employees(employee_id),
    FOREIGN KEY (updated_by) REFERENCES employees(employee_id)
);

-- Insert Salary Records
INSERT INTO employee_salary (employee_id, payment_date, amount, description, status, disbursed_by, disbursed_at, updated_by)
VALUES
(1, '2025-01-10', 45000.00, 'October Monthly Salary', 'DISBURSED', 3, '2025-01-10 10:30:00', 3),
(2, '2025-01-10', 42000.00, 'October Monthly Salary', 'DISBURSED', 3, '2025-01-10 10:35:00', 3),

(3, '2025-01-10', 55000.00, 'October Monthly Salary', 'DISBURSED', 4, '2025-01-10 11:00:00', 4),
(4, '2025-01-10', 38000.00, 'October Monthly Salary', 'DISBURSED', 4, '2025-01-10 11:15:00', 4),
(5, '2025-01-10', 40000.00, 'October Monthly Salary', 'PENDING', NULL, NULL, 5),

(6, '2025-01-10', 70000.00, 'October Monthly Salary', 'DISBURSED', 3, '2025-01-10 12:20:00', 2),
(7, '2025-01-10', 60000.00, 'October Monthly Salary', 'PENDING', NULL, NULL, 5),
(8, '2025-01-10', 90000.00, 'October Monthly Salary', 'DISBURSED', 3, '2025-01-10 12:30:00', 2),
(9, '2025-01-10', 50000.00, 'October Monthly Salary', 'DISBURSED', 3, '2025-01-10 12:40:00', 3),
(10, '2025-01-10', 75000.00, 'October Monthly Salary', 'PENDING', NULL, NULL, 5),

(11, '2025-01-10', 48000.00, 'October Monthly Salary', 'DISBURSED', 4, '2025-01-10 13:00:00', 4),
(12, '2025-01-10', 65000.00, 'October Monthly Salary', 'DISBURSED', 3, '2025-01-10 13:10:00', 3),
(13, '2025-01-10', 35000.00, 'October Monthly Salary', 'PENDING', NULL, NULL, 5),
(14, '2025-01-10', 41000.00, 'October Monthly Salary', 'DISBURSED', 3, '2025-01-10 13:25:00', 3),
(15, '2025-01-10', 47000.00, 'October Monthly Salary', 'DISBURSED', 4, '2025-01-10 13:35:00', 4),

(16, '2025-01-10', 52000.00, 'October Monthly Salary', 'DISBURSED', 3, '2025-01-10 14:00:00', 2),
(17, '2025-01-10', 53000.00, 'October Monthly Salary', 'DISBURSED', 3, '2025-01-10 14:10:00', 2),

(18, '2025-01-10', 60000.00, 'October Monthly Salary', 'PENDING', NULL, NULL, 5),
(19, '2025-01-10', 68000.00, 'October Monthly Salary', 'DISBURSED', 3, '2025-01-10 14:25:00', 3),
(20, '2025-01-10', 62000.00, 'October Monthly Salary', 'PENDING', NULL, NULL, 5);
