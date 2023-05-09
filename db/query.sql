USE company_db;
SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;

SELECT first_name, last_name, title, salary, department.name as department
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id;

