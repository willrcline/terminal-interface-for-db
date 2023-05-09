USE company_db;

INSERT INTO department (name)
VALUES
    ("Engineering"),
    ("Marketing");

INSERT INTO role (title, salary, department_id)
VALUES
	("AI Developer", 150000, 1),
	("Head of Marketing", 100000, 2),
	("Head of Engineering", 200000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Will", "Cline", 3, 1),
    ("Ryan", "Holiday", 2, 2),
    ("Joe", "Givony", 1, 1);
