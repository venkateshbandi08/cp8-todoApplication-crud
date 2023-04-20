const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "todoApplication.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//checking todo database
// app.get("/todos/", async (request, response) => {
//   const getDatabaseQuery = `
//         SELECT * FROM todo;
//     `;
//   const todoDatabase = await db.all(getDatabaseQuery);
//   response.send(todoDatabase);
// });

// API 1 - SCENARIO 1
app.get("/todos/", async (request, response) => {
  const { status } = request.query;
  const getTodoQuery = `
        SELECT * FROM todo
        WHERE 
        status LIKE '${status}';
    `;
  const todoArray = await db.all(getTodoQuery);
  response.send(todoArray);
});

// API 1 - SCENARIO - 2
app.get("/todos/", async (request, response) => {
  const { priority } = request.query;
  const getHighQuery = `
        SELECT * FROM todo
        WHERE
        priority LIKE '${priority}';
    `;
  const highArray = await db.all(getHighQuery);
  response.send(highArray);
});

// API 1 - SCENARIO - 3
app.get("/todos/", async (request, response) => {
  const { priority, status } = request.query;
  const getPriorityAndStatusQuery = `
    SELECT * FROM todo
    WHERE
    priority LIKE '${priority}' AND status LIKE '${status}';
  `;
  const priorityAndStatusArray = await db.all(getPriorityAndStatusQuery);
  response.send(priorityAndStatusArray);
});

// API 1 - SCENARIO - 4
app.get("/todos/", async (request, response) => {
  const { search_q } = request.query;
  const getSearchQuery = `
        SELECT * FROM todo
        WHERE 
        todo LIKE '%${search_q}%';
    `;
  const searchArray = await db.all(getSearchQuery);
  response.send(searchArray);
});

// API - 2
app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getTodoIdQuery = `
        SELECT * FROM todo
        WHERE id = ${todoId};
    `;
  const todoIdObject = await db.get(getTodoIdQuery);
  response.send(todoIdObject);
});

// API - 3
app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;
  const postTodoQuery = `
        INSERT INTO todo(id, todo, priority, status)
        VALUES(
            ${id},
            '${todo}',
            '${priority}',
            '${status}'
        );
    `;
  await db.run(postTodoQuery);
  response.send("Todo Successfully Added");
});

// API - 4 SCENARIO - 1
app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const { status } = request.body;
  const updateStatusQuery = `
        UPDATE todo
        SET 
        status = '${status}'
        WHERE id = ${todoId};
    `;
  await db.run(updateStatusQuery);
  response.send("Status Updated");
});

// API - 4 SCENARIO - 2
app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const { priority } = request.body;
  const updatePriorityQuery = `
        UPDATE todo
        SET 
        priority = '${priority}'
        WHERE id = ${todoId};
    `;
  await db.run(updatePriorityQuery);
  response.send("Priority Updated");
});

// API - 4 SCENARIO - 3
app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const { todo } = request.body;
  const updateTodoQuery = `
        UPDATE todo
        SET 
        todo = '${todo}'
        WHERE id = ${todoId};
    `;
  await db.run(updateTodoQuery);
  response.send("Todo Updated");
});

// API - 5
app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteTodoQuery = `
        DELETE FROM todo
        WHERE
        id = ${todoId};
    `;
  await db.run(deleteTodoQuery);
  response.send("Todo Deleted");
});

module.exports = app;
