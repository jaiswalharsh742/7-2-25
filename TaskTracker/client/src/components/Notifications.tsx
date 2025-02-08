import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { Task } from "@shared/schema";

export default function Notifications() {
  const { toast } = useToast();
  const { data: tasks } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  useEffect(() => {
    if (!tasks) return;

    const now = new Date();
    const highPriorityTasks = tasks.filter(
      (task) =>
        !task.completed &&
        task.priority === 3 &&
        new Date(task.dueDate) > now &&
        new Date(task.dueDate).getTime() - now.getTime() < 24 * 60 * 60 * 1000
    );

    highPriorityTasks.forEach((task) => {
      toast({
        title: "High Priority Task Due Soon",
        description: `"${task.title}" is due ${format(new Date(task.dueDate), "MMM d")}`,
        variant: "destructive",
      });
    });
  }, [tasks, toast]);

  return null;
}
