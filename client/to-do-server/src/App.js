import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {
  state = {
    tasks: [
      {id: 1, name: 'Shopping'},
      {id: 2, name: 'Mliko kup'},
    ],
    taskName: '',
  }

componentDidMount() {
  this.socket = io('localhost:8000');
  this.socket.on('updateTasks', (tasks) => this.updateTasks(tasks));
  this.socket.on('removeTask', (id) => this.removeTask(id));
  this.socket.on('addTask', ({id, name}) => this.addTask(id, name));
}

updateTasks(newTasks) {
  this.setState({
    tasks: newTasks,
  });
};

addTask(id, name) {
  const newTask = {
    id,
    name,
  };
  this.setState({ tasks: [...this.state.tasks, newTask ]});
}

removeTask(id, name = false) {
  console.log(name);
  this.setState({
    tasks: this.state.tasks.filter(task => task.id !== id),
  });
  if(name) this.socket.emit('removeTask', id);
}

submitForm(event) {
  event.preventDefault();
  const id = uuidv4();
  this.addTask(id, this.state.taskName);
  this.socket.emit('addTask', { id: id, name: this.state.taskName });
  this.setState({ taskName: '' });
}

  render() {
    const {tasks, taskName} = this.state;
    return (
      <div className="App">
    
        <header>
          <h1>ToDoList.app</h1>
        </header>
    
        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
    
          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map(task => (
              <li key={task.id} className='task'>
                {task.name}
                <button className="btn btn--red" onClick={() => this.removeTask(task.id, task.name)}>Remove</button>
              </li>
            ))}
          </ul>
          <form 
            id="add-task-form"
            onSubmit={event => this.submitForm(event)}
            >
            <input 
              className='text-input'
              autoComplete="off" 
              type="text" 
              placeholder="Type your description" 
              id="task-name" 
              value={taskName}
              onChange={event => this.setState({taskName: event.currentTarget.value})}
            />
            <button className="btn" type="submit">Add</button>
          </form>
    
        </section>
      </div>
    );
  };

};

export default App;