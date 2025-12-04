import { useState , useEffect}  from "react";
import FilterBar from "./components/FilterBar";
import './App.css';
import StatsBar from "./components/StatsBar";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

function App(){
  //loacal storage
  const [tasks, setTasks] = useState(()=>{
    const saveTask = localStorage.getItem('myTasks');
    return saveTask ? JSON.parse(saveTask) : []
  });


  const [filter, setFilter] = useState('All');

  const totalTask = tasks.length;
  const completedTask = tasks.filter(t => t.completed).length;
  const pendingTask = totalTask - completedTask;   

  const filterTask = tasks.filter((tasks)=> {
    if(filter === 'Pending') return !tasks.completed;
    if(filter === 'Completed') return tasks.completed;
    return true;
  });

  

  useEffect(()=>{
    localStorage.setItem("myTasks", JSON.stringify(tasks));
  }, [tasks]);
  
  //delete fun
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };
  //complete check
  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };
  //new task add mate
  const addTask = (taskData) => {
    const newTask = {
      id: Date.now(), 
      ...taskData, 
      completed: false
    };
    setTasks([...tasks, newTask]); 
  };
  return(
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
        <TaskForm onAddTask={addTask}/>
        <FilterBar filter={filter} setFilter={setFilter}></FilterBar>
        <TaskList tasks={filterTask}
                  onDeleteTask={deleteTask} 
                  onToggleTask={toggleTask}
        />
      </main>
    </div>
  )
}

export default App;