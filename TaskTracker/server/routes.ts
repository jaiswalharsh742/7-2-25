import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema } from "@shared/schema";
import { z } from "zod";

export function registerRoutes(app: Express): Server {
  // Add cache headers for static assets
  app.use((req, res, next) => {
    if (req.url.match(/\.(js|css|png|jpg|jpeg|gif|ico)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
    }
    next();
  });

  app.get("/api/tasks", async (_req, res) => {
    const tasks = await storage.getTasks();
    res.setHeader('Cache-Control', 'private, max-age=0, must-revalidate');
    res.json(tasks);
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const task = insertTaskSchema.parse(req.body);
      const created = await storage.createTask(task);
      res.status(201).json(created);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.patch("/api/tasks/:id/toggle", async (req, res) => {
    const id = parseInt(req.params.id);
    const { completed } = req.body;

    if (typeof completed !== "boolean") {
      return res.status(400).json({ message: "completed must be a boolean" });
    }

    const updated = await storage.updateTask(id, completed);
    if (!updated) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updated);
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteTask(id);

    if (!success) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(204).send();
  });

  return createServer(app);
}