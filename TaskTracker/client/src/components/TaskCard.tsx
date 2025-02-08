import { format } from "date-fns";
import { CheckCircle, Clock, Flag, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { Task } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { priorityLabels } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

const priorityColors = {
  1: "text-blue-500",
  2: "text-orange-500",
  3: "text-red-500",
};

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { toast } = useToast();

  const toggleMutation = useMutation({
    mutationFn: async (completed: boolean) => {
      const res = await apiRequest("PATCH", `/api/tasks/${task.id}/toggle`, { completed });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/tasks/${task.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Card className={task.completed ? "opacity-50" : undefined}>
      <CardContent className="p-4 flex items-start gap-4">
        <Checkbox
          checked={task.completed}
          onCheckedChange={(checked) => toggleMutation.mutate(checked as boolean)}
          disabled={toggleMutation.isPending}
        />

        <div className="flex-1 min-w-0">
          <h3 className={`font-medium truncate ${task.completed ? "line-through" : ""}`}>
            {task.title}
          </h3>

          <div className="mt-2 flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {format(new Date(task.dueDate), "MMM d, yyyy")}
            </span>

            <span className={`flex items-center gap-1 ${priorityColors[task.priority]}`}>
              <Flag className="h-4 w-4" />
              {priorityLabels[task.priority]}
            </span>

            {task.completed && (
              <span className="flex items-center gap-1 text-green-500">
                <CheckCircle className="h-4 w-4" />
                Completed
              </span>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteMutation.mutate()}
          disabled={deleteMutation.isPending}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}