const inquirer = require("inquirer");
const mysql = require('mysql2');


const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: '',
      database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
  );
  
//   // Query database
//   db.query('SELECT * FROM students', function (err, results) {
//     console.log(results);
//   });

const questions = [
    {
        type: 'list',
        name: 'commandCategory',
        message: `What do you want to do in the database?`,
        choices: ['View Data', 'Add or Update Data'],
    },
    {
        type: 'list',
        name: 'table',
        message: `Which table?`,
        choices: ["department", "role", "employee"],
    },
    {
        type: 'list',
        name: 'table',
        message: `What table do you want to add to`,
        choices: ["department", "role", "employee"],
        when: (answers) => answers.commandCategory == "View Data"
    },
    {
        type: 'input',
        name: 'name',
        message: `New department name:`,
        filter: (input) => {
            return `"${input}"`;
          },
        when: (answers) => (answers.commandCategory == "Add or Update Data") && (answers.table == "department")
    },
    {
        type: 'input',
        name: 'title',
        message: `New role title:`,
        filter: (input) => {
            return `"${input}"`;
          },
        when: (answers) => (answers.commandCategory == "Add or Update Data") && (answers.table == "role")
    },
    {
        type: 'input',
        name: 'salary',
        message: `New role salary:`,
        when: (answers) => (answers.commandCategory == "Add or Update Data") && (answers.table == "role")
    },
    {
        type: 'list',
        name: 'department_id',
        message: `department_id:`,
        choices: () => {
            return new Promise((resolve, reject) => {
                db.query('SELECT id FROM department', (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results.map(result => result.id));
                    }
                });
            });
        },
        when: (answers) => (answers.commandCategory == "Add or Update Data") && (answers.table == "role")
    },
    {
        type: 'input',
        name: 'firstName',
        message: `New employee first name:`,
        filter: (input) => {
            return `"${input}"`;
          },
        when: (answers) => (answers.commandCategory == "Add or Update Data") && (answers.table == "employee")
    },
    {
        type: 'input',
        name: 'lastName',
        message: `New employee last name:`,
        filter: (input) => {
            return `"${input}"`;
          },
        when: (answers) => (answers.commandCategory == "Add or Update Data") && (answers.table == "employee")
    },
    {
        type: 'list',
        name: 'role_id',
        message: `role_id:`,
        choices: () => {
            return new Promise((resolve, reject) => {
                db.query('SELECT id FROM role', (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results.map(result => result.id));
                    }
                });
            });
        },
        when: (answers) => (answers.commandCategory == "Add or Update Data") && (answers.table == "employee")
    },
    {
        type: 'list',
        name: 'manager_id',
        message: `manager_id:`,
        choices: () => {
            return new Promise((resolve, reject) => {
                db.query('SELECT id FROM employee', (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results.map(result => result.id));
                    }
                });
            });
        },
        when: (answers) => (answers.commandCategory == "Add or Update Data") && (answers.table == "employee")
    }, 
  ]

  function getColumnNames(tableName) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = ? AND COLUMN_KEY != 'PRI'
        ORDER BY ORDINAL_POSITION;
      `;
      db.query(query, tableName, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results.map(result => result.COLUMN_NAME).join(', '));
        }
      });
    });
  }
  

function getInsertValuesFromAnswersObjInStrFormat(obj) {
    const values = [];
    let skipFirstTwoKeys = 0;
  
    for (const key in obj) {
      if (skipFirstTwoKeys >= 2) {
        values.push(obj[key]);
      }
      skipFirstTwoKeys++;
    }
  
    return values.join(', ');
  }
  

async function init() {
    var answers = await inquirer.prompt(questions)
    // console.log(answers)
    switch (answers.commandCategory){
        case "View Data":
            db.query(`SELECT * FROM ${answers.table}`, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    console.table(results)
                }
            })
            break
        case "Add or Update Data":
            var column_names = await getColumnNames(answers.table)

            var row_values = getInsertValuesFromAnswersObjInStrFormat(answers)
            db.query(`INSERT INTO ${answers.table} (${column_names}) VALUES (${row_values})`)
            console.log(`Added data to "${answers.table}" table.
            
            `)
            break;
    }
    init()
}

init()