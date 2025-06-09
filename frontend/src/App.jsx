import React, { useEffect, useState } from "react";
import axios from "axios";
import VoiceInput from "./component/voice";
import { Trash2, ClipboardX } from "lucide-react";
import "./App.css";

const API = "https://voice-todolist.onrender.com";

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios
      .get(`${API}/api/tasks`)
      .then((res) => setTasks(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleAddTask = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

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

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API}/api/tasks/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  return (
    <>
      <video
        src="./bg.mp4"
        autoPlay
        muted
        loop
        className="bg-video opacity-90 h-screen w-screen object-cover -z-2 absolute"
      ></video>

      <div className="p-[3%] max-w-xl mx-auto h-screen">
        <h2 className="text-3xl text-white font-bold mb-4">
          Voice To-Do List
        </h2>
        <VoiceInput onAdd={handleAddTask} />
        <ul className="mt-6 space-y-2 bg-pink-800 rounded-xl p-5 min-h-[80%]">
          {tasks.map((task) => (
            <li
              key={task._id}
              onClick={() => handleToggleComplete(task._id, task.completed)}
              className={`bg-pink-300 px-[5%] py-[2%] text-pink-900 text-lg relative rounded cursor-pointer ${
                task.completed ? "line-through" : ""
              }`}
            >
              {task.text}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTask(task._id);
                }}
                className="text-pink-700 my-1 hover:text-pink-800 absolute right-10"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))}
          {tasks.length === 0 && (
            <li className="flex flex-col items-center text-2xl font-bold text-gray-300 my-[20%]">
              <ClipboardX size={100} />
              List is Empty
            </li>
          )}
        </ul>
      </div>
    </>
  );
}

export default App;
