import { useState } from "react";
function TaskForm({onAddTask}){

    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [description, setDescription] = useState("");

    const handleSubmit = (e) =>{
        e.preventDefault();

        if(!title.trim()) return;

        onAddTask({title, priority, description});

        setTitle("");
        setDescription("");
        setPriority("Medium");
    }
    return  (
        <div className="form-container">
            <h3>Add New Task</h3>
            <form onSubmit={handleSubmit}>

                <div className="input-group">
                    <input type="text" placeholder="write here task" required className="task-input" value={title} onChange={(e)=>
                        setTitle(e.target.value)
                    }/>
                </div>
                <div>
                    <input type="textarea " placeholder="description" className="task-input" row="2" value={description} onChange={(e)=> setDescription(e.target.value)}/>
                </div>
                <div className="row">
                    <select className="priority-select"
                            value={priority}
                            onChange={(e)=> setPriority(e.target.value)}>
                        <option value="Low">Low Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="High">High Priority</option>
                    </select>

                    <button type="submit" className="add-btn">+ Add Task</button>
                </div>
            </form>
        </div>
    );
}

export default TaskForm;