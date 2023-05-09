DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;
USE company_db;

CREATE TABLE department (
id INT AUTO_INCREMENT,
name varchar(50),
PRIMARY KEY (id)
);

CREATE TABLE role (
id int auto_increment,
title varchar(50), 
salary int,
department_id int,
PRIMARY KEY (id),
foreign key (department_id) references department(id)
);

CREATE TABLE employee (
id int auto_increment,
first_name varchar(50), 
last_name varchar(50), 
role_id int, 
manager_id int,
PRIMARY KEY (id),
foreign key (role_id) references role(id),
foreign key (manager_id) references employee(id)
);


