import React, { useEffect, useState } from "react";
import axios from "axios";
import VoiceInput from "./component/voice";
import "./App.css";
import { Trash2,ClipboardX } from "lucide-react";

function App() {
  const [tasks, setTasks] = useState([]);
  const API ="https://voice-todolist.onrender.com";
  useEffect(() => {
    axios
      .get(`${API}/api/tasks`)
      .then((res) => setTasks(res.data.map((task) => ({ ...task }))))
      .catch((err) => console.error(err));
  }, []);
  const handleToggleComplete = async (id, currentStatus) => {
    try {
      const res = await axios.put(`${API}/api/tasks/${id}`, {
        completed: !currentStatus,
      });
      setTasks(
        tasks.map((task) =>
          task._id === id ? { ...task, completed: res.data.completed } : task
        )
      );
    } catch (err) {
      console.error("Failed to toggle task:", err);
    }
  };

  const handleAddTask = (newTask) => {
    setTasks([newTask, ...tasks]);
  };
  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API}/api/tasks/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  return (
    <div className="p-[5%] max-w-xl mx-auto md:border my-[5%]  h-screen">
      <h2 className="text-3xl font-bold mb-4"> Voice To-Do List</h2>
      <VoiceInput onAdd={handleAddTask} />
      <ul className="mt-6 space-y-2 border border-gray-300 p-5 min-h-[70%]">
        {tasks.map((task) => (
          <li
            key={task._id}
            onClick={() => handleToggleComplete(task._id, task.completed)}
            className={`bg-gray-200 p-2  relative rounded border border-gray-300 cursor-pointer ${
              task.completed && "line-through text-gray-500"
            }`}
          >
            {task.text}
            <button
              onClick={(e) => {
                e.stopPropagation(); // prevent li onClick
                handleDeleteTask(task._id);
              }}
              className="text-red-500 hover:text-red-700 absolute right-10"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </li>
        ))}
        <li className={`flex flex-col items-center text-2xl font-bold text-gray-300 my-[20%] ${tasks.length >0 && "hidden" }`}>  <ClipboardX size={100}/>List is Empty
        </li>
      </ul>
    </div>
  );
}

export default App;
