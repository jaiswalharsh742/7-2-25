import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskCard from "./TaskCard";
import type { Task } from "@shared/schema";
import { ClipboardX } from "lucide-react";

function NoTasks({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
      <ClipboardX className="h-12 w-12 mb-4 text-muted" />
      <p className="text-lg font-medium">No Items Found</p>
      <p className="text-sm">{message}</p>
    </div>
  );
}

export default function TaskList() {
  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-[#2F3542]">Tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const activeTasks = (tasks || []).filter(task => !task.completed).sort((a, b) => {
    if (a.priority !== b.priority) return b.priority - a.priority;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const completedTasks = (tasks || []).filter(task => task.completed).sort((a, b) => {
    if (a.priority !== b.priority) return b.priority - a.priority;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#2F3542]">Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">
              Active ({activeTasks.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedTasks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeTasks.length === 0 ? (
              <NoTasks message="Add a new task to get started!" />
            ) : (
              activeTasks.map((task) => <TaskCard key={task.id} task={task} />)
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedTasks.length === 0 ? (
              <NoTasks message="No completed tasks yet." />
            ) : (
              completedTasks.map((task) => <TaskCard key={task.id} task={task} />)
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}