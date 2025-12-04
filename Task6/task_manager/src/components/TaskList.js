import TaskItem from './TaskItem'; 

function TaskList({ tasks , onDeleteTask , onToggleTask}) {

    if(tasks.length === 0){
        return <p style={{textAlign: 'center', color: '#888'}}>No task yet! add one</p>
    }
  return (
    <div className="task-list-container">
      <h3>Your Tasks({tasks.length})</h3>
      <div className="list-wrapper">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onDeleteTask={onDeleteTask} onToggleTask={onToggleTask} />
        ))}
      </div>
    </div>
  );
}

export default TaskList;