//npm install express sqlite3 sqlite
//node BD4.5_HW2/initDB.js
//node BD4.5_HW2
const { Console } = require("console");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

const app = express();
const PORT = process.env.PORT || 3000;
let db;

(async () => {
  db = await open({
    filename: "./BD4.5_HW2/database.sqlite",
    driver: sqlite3.Database,
  });
})();

app.get("/", (req, res) => {
  res.status(200).json({ message: "BD4.5_HW2" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/*
Exercise 1: Fetch Employees by Minimum Salary

Create an endpoint /employees/salary to return employees with a salary greater than a specified value.

Declare a variable minSalary to store the query parameter.

Create a function filterEmployeesBySalary to fetch the employees from the database greater than equal to the minimum salary.

Wrap the function call in a try-catch block.

Ensure that errors are caught and return res.status(500).json({ error: error.message }) if anything goes wrong.

Return a 404 error if no data is found.

API Call

http://localhost:3000/employees/salary?minSalary=80000
*/
// function to fetch employees by minimum salary
async function filterEmployeesBySalary(minSalary) {
  let query = "SELECT * FROM employees WHERE salary >= ?";
  try {
    if (!db) {
      throw new Error("Database not connected");
    }
    let result = await db.all(query, [minSalary]);
    if (!result || result.length == 0) {
      throw new Error(
        "No Employees found with salary greater than equal to the  :" +
          minSalary,
      );
    }
    return { employees: result };
  } catch (error) {
    console.log("Error in fetching Employees ", error.message);
    throw error;
  }
}
// end point to fetch employees by minimum salary
app.get("/employees/salary", async (req, res) => {
  try {
    let minSalary = req.query.minSalary;
    let result = await filterEmployeesBySalary(minSalary);
    console.log(
      "Succesfully fetched " +
        result.employees.length +
        " employees with salary greater than equal to the  :" +
        minSalary,
    );
    return res.status(200).json(result);
  } catch (error) {
    if (
      error.message ===
      "No Employees found with salary greater than equal to the  :" + minSalary
    ) {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});

/*
Exercise 2: Fetch Employees by Department and Minimum Experience

Create an endpoint /employees/department-experience to return employees by a specific department with years of experience greater than a specified value.

Declare 2 variables named department & minExperience to store query parameter values.

Create a function filterEmployeesByDepartmentAndExperience to fetch the employees from the database based on the department and minimum experience ( greater than or equal to ).

Wrap the function call in a try-catch block.

Ensure that errors are caught and return res.status(500).json({ error: error.message }) if anything goes wrong.

Return a 404 error if no data is found.

API Call

http://localhost:3000/employees/department-experience?department=Engineering&minExperience=5
*/
// function to fetch employees by department and minimum experience
async function filterEmployeesByDepartmentAndExperience(
  department,
  minExperience,
) {
  let query =
    "SELECT * FROM employees WHERE department = ? AND years_of_experience >= ?";
  try {
    if (!db) {
      throw new Error("Database not connected");
    }
    let result = await db.all(query, [department, minExperience]);
    if (!result || result.length == 0) {
      throw new Error(
        "No Employees found with department :" +
          department +
          " and years of experience greater than equal to the  :" +
          minExperience,
      );
    }
    return { employees: result };
  } catch (error) {
    console.log("Error in fetching Employees ", error.message);
    throw error;
  }
}
// end point to fetch employees by department and minimum experience
app.get("/employees/department-experience", async (req, res) => {
  try {
    let department = req.query.department;
    let minExperience = req.query.minExperience;
    let result = await filterEmployeesByDepartmentAndExperience(
      department,
      minExperience,
    );
    console.log(
      "Succesfully fetched " +
        result.employees.length +
        " employees with department :" +
        department +
        " and years of experience greater than equal to the  :" +
        minExperience,
    );
    return res.status(200).json(result);
  } catch (error) {
    if (
      error.message ===
      "No Employees found with department :" +
        department +
        " and years of experience greater than equal to the  :" +
        minExperience
    ) {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});
/*
Exercise 3: Fetch Employees Ordered by Salary

Create an endpoint /employees/ordered-by-salary to return employees ordered by salary in descending order.

Create a function fetchEmployeesOrderedBySalary to fetch the employees from the database and order them by salary ( highest to lowest salary ).

Wrap the function call in a try-catch block.

Ensure that errors are caught and return res.status(500).json({ error: error.message }) if anything goes wrong.

Return a 404 error if no data is found.

API Call

http://localhost:3000/employees/ordered-by-salary
*/
// function to fetch employees ordered by salary
async function fetchEmployeesOrderedBySalary() {
  let query = "SELECT * FROM employees ORDER BY salary DESC";
  try {
    if (!db) {
      throw new Error("Database not connected");
    }
    let result = await db.all(query, []);
    if (!result || result.length == 0) {
      throw new Error("No Employees found");
    }
    return { employees: result };
  } catch (error) {
    console.log("Error in fetching Employees ", error.message);
    throw error;
  }
}
// end point to fetch employees ordered by salary
app.get("/employees/ordered-by-salary", async (req, res) => {
  try {
    let result = await fetchEmployeesOrderedBySalary();
    console.log(
      "Succesfully fetched " +
        result.employees.length +
        " employees ordered by salary in descending order",
    );
    return res.status(200).json(result);
  } catch (error) {
    if (error.message === "No Employees found") {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});
