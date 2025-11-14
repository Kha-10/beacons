"use client";

import { useMemo, useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { initialColumns, initialTasks, users } from "@/lib/taskData";
import type { Column, Task, User } from "@/lib/types";
import KanbanColumn from "./KanbanColumn";
import KanbanTask from "@/components/kanban/KanBanTask";
import TaskSheet from "./TaskSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";

let idCounter = initialTasks.length + initialColumns.length;
const generateId = () => {
  return String(++idCounter);
};

export default function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [allUsers] = useState<User[]>(users);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // 3px
      },
    })
  );

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const addColumn = () => {
    if (!newColumnTitle.trim()) return;

    const newColumn: Column = {
      id: generateId(),
      title: newColumnTitle.trim(),
    };
    setColumns([...columns, newColumn]);
    setNewColumnTitle("");
    setIsAddingColumn(false);
  };

  const updateColumn = (id: string, title: string) => {
    setColumns(columns.map((col) => (col.id === id ? { ...col, title } : col)));
  };

  const deleteColumn = (id: string) => {
    setColumns(columns.filter((col) => col.id !== id));
    setTasks(tasks.filter((task) => task.columnId !== id));
  };

  const addTask = (columnId: string, content: string) => {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content,
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, content: string) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, content } : task))
    );
  };

  const updateTaskDetails = (updatedTask: Task) => {
    setTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    if (selectedTask?.id === updatedTask.id) {
      setSelectedTask(updatedTask);
    }
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (isActiveAColumn) {
      setColumns((columns) => {
        const activeColumnIndex = columns.findIndex(
          (col) => col.id === activeId
        );
        const overColumnIndex = columns.findIndex((col) => col.id === overId);
        return arrayMove(columns, activeColumnIndex, overColumnIndex);
      });
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId.toString();
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }

  if (!isClient) {
    return null;
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        collisionDetection={closestCenter}
      >
        <div className="flex h-full min-h-0 w-full items-start gap-4 overflow-x-auto">
          <div className="flex h-full gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <KanbanColumn
                  key={col.id}
                  column={col}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                  allUsers={allUsers}
                  updateColumn={updateColumn}
                  deleteColumn={deleteColumn}
                  addTask={addTask}
                  updateTask={updateTask}
                  updateTaskDetails={updateTaskDetails}
                  deleteTask={deleteTask}
                  onTaskClick={setSelectedTask}
                />
              ))}
            </SortableContext>
          </div>
          <div className="w-72 flex-shrink-0 pt-1">
            {isAddingColumn ? (
              <div className="space-y-2 rounded-lg bg-card p-2">
                <Input
                  placeholder="Enter list title..."
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addColumn()}
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <Button onClick={addColumn} size="sm">
                    Add list
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsAddingColumn(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="ghost"
                className="w-full justify-start bg-primary/10 hover:bg-primary/20"
                onClick={() => setIsAddingColumn(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add another list
              </Button>
            )}
          </div>
        </div>
        <DragOverlay>
          {activeColumn && (
            <KanbanColumn
              column={activeColumn}
              tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
              allUsers={allUsers}
              updateColumn={updateColumn}
              deleteColumn={deleteColumn}
              addTask={addTask}
              updateTask={updateTask}
              updateTaskDetails={updateTaskDetails}
              deleteTask={deleteTask}
              onTaskClick={setSelectedTask}
            />
          )}
          {activeTask && (
            <KanbanTask
              task={activeTask}
              allUsers={allUsers}
              updateTask={updateTask}
              updateTaskDetails={updateTaskDetails}
              deleteTask={deleteTask}
              onClick={() => setSelectedTask(activeTask)}
            />
          )}
        </DragOverlay>
      </DndContext>
      <TaskSheet
        task={selectedTask}
        columns={columns}
        onOpenChange={(isOpen) => !isOpen && setSelectedTask(null)}
        onUpdateTask={updateTaskDetails}
      />
    </>
  );
}
