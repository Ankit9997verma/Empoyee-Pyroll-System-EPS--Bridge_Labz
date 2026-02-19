const express = require('express');
const app = express();
const PORT = 3000;

// Import file read/write functions
const { readFile, writeFile } = require('./Modules/fileHandler');

// Middlewares
app.use(express.json());  // Parse JSON data
app.use(express.urlencoded({ extended: true }));  // Parse form data
app.use(express.static("public"));  // Serve static files (CSS)
app.set("view engine", "ejs");  // Set EJS as template engine


/* ================= DASHBOARD ================= */

// Display dashboard with employee data & statistics
app.get('/', (req, res) => {

    const employees = readFile();  // Read employee data from JSON

    const totalEmployees = employees.length;  // Count employees

    const totalSalary = employees.reduce((sum, emp) => 
        sum + emp.salary, 0);  // Calculate total salary

    const totalNetSalary = employees.reduce((sum, emp) => 
        sum + (emp.salary * 0.90), 0);  // Salary after 10% tax

    const averageSalary = totalEmployees > 0
        ? (totalSalary / totalEmployees).toFixed(2)
        : 0;  // Calculate average salary safely

    const departmentCount =
        new Set(employees.map(emp => emp.department)).size;  
        // Count unique departments

    res.render('index', {
        employees,
        totalEmployees,
        totalSalary,
        totalNetSalary: totalNetSalary.toFixed(2),
        averageSalary,
        departmentCount
    });
});


/* ================= ADD EMPLOYEE ================= */

// Show add employee form
app.get('/add', (req, res) => {
    res.render('add');
});

// Handle form submission & add new employee
app.post('/add', (req, res) => {

    const { name, department, salary, gender, profile } = req.body;

    const employees = readFile();

    const newEmployee = {
        id: Date.now(),
        name,
        department,
        gender,
        profile: profile || "avatar1.png",
        salary: Number(salary)
    };

    employees.push(newEmployee);
    writeFile(employees);

    res.redirect('/');
});



/* ================= DELETE EMPLOYEE ================= */

// Delete employee by ID
app.get('/delete/:id', (req, res) => {

    const employeeId = parseInt(req.params.id);

    let employees = readFile();

    employees = employees.filter(emp => emp.id !== employeeId);  
    // Remove employee from array

    writeFile(employees);  // Save changes

    res.redirect('/');
});


/* ================= EDIT EMPLOYEE ================= */

// Show edit form with existing data
app.get('/edit/:id', (req, res) => {

    const employeeId = parseInt(req.params.id);

    const employees = readFile();

    const employee = employees.find(emp => emp.id === employeeId);

    if (!employee) {
        return res.redirect('/');
    }

    res.render('edit', { employee });
});

// Handle update submission
app.post('/edit/:id', (req, res) => {

    const employeeId = parseInt(req.params.id);
    const { name, department, salary, gender, profile } = req.body;

    let employees = readFile();

    const index = employees.findIndex(emp => emp.id === employeeId);

    if (index !== -1) {
        employees[index] = {
            id: employeeId,
            name,
            department,
            gender,
            profile,
            salary: Number(salary)
        };

        writeFile(employees);
    }

    res.redirect('/');
});



/* ================= SERVER ================= */

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});