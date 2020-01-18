import React, { useState, useEffect } from "react";
import randomWords from "random-words";

const createTasks = (amount, tasks = []) =>
  amount
    ? createTasks(amount - 1, [
        ...tasks,
        {
          id: Math.floor(Math.random() * 100),
          details: randomWords({
            join: " ",
            min: 2,
            max: 4
          }),
          completed: false,
          editing: false
        }
      ])
    : tasks;

const Tasks = ({ tasks, toggleCompleted, toggleEditing, changeDetails }) =>
  tasks.map(({ id, details, completed, editing }, index) => (
    <div key={index} className="todo">
      {editing ? (
        <textarea
          autoFocus
          type="text"
          defaultValue={details}
          onChange={changeDetails(index)}
          onBlur={toggleEditing(index)}
        />
      ) : (
        <div
          className={`details ${completed ? "done" : ""}`}
          onClick={toggleEditing(index)}
        >
          <div>{details}</div>
        </div>
      )}
      <input
        className="toggle"
        type="checkbox"
        checked={completed}
        onChange={toggleCompleted(index)}
      />
    </div>
  ));

const AddTaskButtons = ({
  fetchTasks,
  tasks,
  setTasks,
  amountToAdd,
  setAmountToAdd
}) => (
  <div className="buttons">
    <button
      onClick={() =>
        fetchTasks(amountToAdd).then(newTasks =>
          setTasks(tasks.concat(newTasks))
        )
      }
    >
      Add {amountToAdd} Random Tasks
    </button>
    <button onClick={() => setAmountToAdd(amountToAdd + 5)}> + </button>
  </div>
);

const fetchTasks = amount =>
  new Promise(resolve => resolve(createTasks(amount)));

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [amountToAdd, setAmountToAdd] = useState(5);

  const toggleCompleted = index => () => {
    const newTasks = [...tasks],
      targetedTask = newTasks[index];

    newTasks.splice(index, 1, {
      ...targetedTask,
      completed: !targetedTask.completed
    });

    return setTasks(newTasks);
  };

  const toggleEditing = (index, editing) => () =>
    setTasks(
      tasks.map((task, taskIndex) => ({
        ...task,
        editing: index === taskIndex ? !task.editing : false
      }))
    );

  const changeDetails = index => e => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1, { ...newTasks[index], details: e.target.value });
    return setTasks(newTasks);
  };

  useEffect(() => {
    fetchTasks(5).then(setTasks);
  }, []);

  return (
    <div className="App">
      <h1>Task List</h1>
      <Tasks {...{ tasks, toggleCompleted, toggleEditing, changeDetails }} />
      <AddTaskButtons
        {...{ tasks, setTasks, fetchTasks, amountToAdd, setAmountToAdd }}
      />
    </div>
  );
}
