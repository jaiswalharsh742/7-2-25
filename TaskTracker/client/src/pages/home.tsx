import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-nunito">Task Manager</CardTitle>
            <ThemeToggle />
          </CardHeader>
        </Card>

        <div className="grid gap-8 md:grid-cols-[350px,1fr]">
          <TaskForm />
          <TaskList />
        </div>
      </div>
    </div>
  );
}