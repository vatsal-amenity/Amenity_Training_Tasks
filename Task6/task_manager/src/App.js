import { useState, useEffect } from "react";
import "./App.css";

import FilterBar from "./components/FilterBar";
import StatsBar from "./components/StatsBar";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import SearchBar from "./components/SearchBar";

function App() {

  //loacal storage
  const [tasks, setTasks] = useState(() => {
    const saveTask = localStorage.getItem("myTasks");
    return saveTask ? JSON.parse(saveTask) : [];
  });

  //search & filter 
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  //update local storage
  useEffect(() => {
    localStorage.setItem("myTasks", JSON.stringify(tasks));
  }, [tasks]);

  //stats calculation
  const totalTask = tasks.length;
  const completedTask = tasks.filter((t) => t.completed).length;
  const pendingTask = totalTask - completedTask;

  //filter and sorting
  const filterTask = tasks
    .filter((task) => {
      if (filter === "Pending") return !task.completed;
      if (filter === "Completed") return task.completed;
      return true;
    })
    .filter((task) => {
      return task.title.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => {
      const prioritynum = { High: 3, Medium: 2, Low: 1 };
      return prioritynum[b.priority] - prioritynum[a.priority];
    });

  //new task add, delete and togglefunction
  const addTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      ...taskData,
      completed: false,
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="app-container">
      <header>
        <h1>My Task Manager</h1>
        <p>{new Date().toDateString()}</p>
      </header>

      <main>
        <StatsBar
          total={totalTask}
          completed={completedTask}
          pending={pendingTask}
        />

        <TaskForm onAddTask={addTask} />
        <SearchBar search={search} setSearch={setSearch}/>
        <FilterBar filter={filter} setFilter={setFilter}></FilterBar>

        <TaskList
          tasks={filterTask}
          onDeleteTask={deleteTask}
          onToggleTask={toggleTask}
        />
      </main>
    </div>
  );
}

export default App;
