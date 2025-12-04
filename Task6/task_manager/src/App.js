import { useState , useEffect}  from "react";
import FilterBar from "./components/FilterBar";
import './App.css';
import StatsBar from "./components/StatsBar";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

function App(){

  //search
  const [search, setSearch] = useState('');
  //loacal storage
  const [tasks, setTasks] = useState(()=>{
    const saveTask = localStorage.getItem('myTasks');
    return saveTask ? JSON.parse(saveTask) : []
  });


  const [filter, setFilter] = useState('All');

  const totalTask = tasks.length;
  const completedTask = tasks.filter(t => t.completed).length;
  const pendingTask = totalTask - completedTask;   

  const filterTask = tasks.filter((task)=> {
    const match = 
      filter === 'All' ?true :
      filter === 'Completed' ? !task.completed :
      task.completed;


      const matchSearch = task.title.toLowerCase().includes(search.toLowerCase());

      return match && matchSearch;
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
        <div className="search-container" style={{ marginBottom: '15px' }}>
          <input 
            type="text"
            placeholder="Search Task..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                    boxSizing: 'border-box' 
                }}
          />
        </div>
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