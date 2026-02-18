const express = require('express');
const fileHandler = require('.modules/fileHandler');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Dashboard
app.get('/', async (req, res) => {
    const employees = await fileHandler.read();
    res.render('index', { employees });
});

// Add Employee Page
app.get('/add', (req, res) => {
    res.render('add');
});

// Add Employee Logic
app.post('/add', async (req, res) => {
    const { name, department, salary } = req.body;

    if (!name || salary < 0) {
        return res.send("Invalid Data");
    }

    const employees = await fileHandler.read();

    const newEmployee = {
        id: Date.now(),
        name,
        department,
        salary: Number(salary)
    };

    employees.push(newEmployee);
    await fileHandler.write(employees);

    res.redirect('/');
});

// Delete Employee
app.get('/delete/:id', async (req, res) => {
    const id = Number(req.params.id);
    let employees = await fileHandler.read();

    employees = employees.filter(emp => emp.id !== id);
    await fileHandler.write(employees);

    res.redirect('/');
});

// Edit Page
app.get('/edit/:id', async (req, res) => {
    const id = Number(req.params.id);
    const employees = await fileHandler.read();

    const employee = employees.find(emp => emp.id === id);

    res.render('edit', { employee });
});

// Update Employee
app.post('/edit/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { name, department, salary } = req.body;

    let employees = await fileHandler.read();

    employees = employees.map(emp => {
        if (emp.id === id) {
            return {
                id,
                name,
                department,
                salary: Number(salary)
            };
        }
        return emp;
    });
    await fileHandler.write(employees);
    res.redirect('/');
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});