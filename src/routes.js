import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;

      const list = database.select("tasks", search);

      return res.end(JSON.stringify(list));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      console.log(title, '-', description)
      if (!title) {
        return res.writeHead(406).end("You must send title in the request");
      }

      if (!description) {
        return res.writeHead(406).end("You must send title in the request");
      }

      const newTask = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      database.insert("tasks", newTask);

      return res.writeHead(201).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      const editted = database.update("tasks", id, title, description);

      if (editted === "ERROR") {
        return res.writeHead(402, "Not found task with this ID").end();
      }

      console.log(editted);

      return res.end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/completed"),
    handler: (req, res) => {
      const { id } = req.params;

      const editted = database.completed("tasks", id);

      if (editted === "ERROR") {
        return res.writeHead(402, "Not found task with this ID").end();
      }

      console.log(editted);

      return res.end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const response = database.delete("tasks", id);

      if (response === "ERROR") {
        return res.writeHead(402, "Not found task with this ID").end();
      }

      return res.writeHead(204).end("Remove task with success");
    },
  },
];
