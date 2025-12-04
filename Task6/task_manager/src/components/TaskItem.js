import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import { FaCheck, FaUndo } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function TaskItem({task , onDeleteTask, onToggleTask}) {

    const getPriorityColor = (p) => {
    if (p === "High") return "#e74c3c";  
    if (p === "Medium") return "#f39c12"; 
    return "#27ae60";                    
  };

  return (
    <div className="task-card" >
      <div className="task-info" style={{opacity: task.completed ? 0.5 : 1}}>
        <span className="priority-badge high" style={{ backgroundColor: getPriorityColor(task.priority)}}
        >
            {task.priority}
        </span>
        <h4>{task.title}</h4> 
        {task.description &&<p style={{fontSize: '14px', color: '#666', margin: '5px 0'}}>{task.description}</p>}
      </div>
      
      <div className="task-actions">
        <button className="btn-complete" onClick={() => onToggleTask(task.id)} style={{marginRight: '10px', 
                backgroundColor: task.completed ? "#f39c12": "#27ae60", 
                color:'white',
                border:'none',
                padding: '5px 10px',
                borderRadius: '4px',
                alignItems: 'center',
                cursor: 'pointer'}}>{task.completed ? <FaUndo/> : <FaCheck />}</button>
        <button className="btn-delete" onClick={() => onDeleteTask(task.id)}><MdDelete /></button>
      </div>
    </div>
  );
}

export default TaskItem;