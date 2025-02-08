import { tasks, type Task, type InsertTask } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getTasks(): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, completed: boolean): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getTasks(): Promise<Task[]> {
    const result = await db.select().from(tasks);
    return result;
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db
      .insert(tasks)
      .values(insertTask)
      .returning();
    return task;
  }

  async updateTask(id: number, completed: boolean): Promise<Task | undefined> {
    const [updated] = await db
      .update(tasks)
      .set({ completed })
      .where(eq(tasks.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteTask(id: number): Promise<boolean> {
    const [deleted] = await db
      .delete(tasks)
      .where(eq(tasks.id, id))
      .returning();
    return !!deleted;
  }
}

export const storage = new DatabaseStorage();