import React, { useRef, useState, useEffect } from "react";
import axios from "axios";

const API = "https://voice-todolist.onrender.com";

const VoiceInput = ({ onAdd }) => {
  const recognitionRef = useRef(null);
  const [on, setON] = useState(false);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const handleStart = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = async (event) => {
      const text = event.results[0][0].transcript.trim();
      console.log("Recognized text:", text);
      if (!text) return;

      try {
        const res = await axios.post(`${API}/api/tasks/add`, { text });
        if (onAdd) onAdd(res.data);
      } catch (err) {
        console.error("Error saving task:", err);
      }
    };

    recognition.onerror = (e) => {
      console.error("Recognition error:", e.error);
    };

    recognition.onend = () => {
      setON(false);
      console.log("Speech recognition ended");
    };

    recognitionRef.current = recognition;
    recognition.start();
    setON(true);
  };

  const handleStop = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onMouseDown={handleStart}
        onMouseUp={handleStop}
        onMouseLeave={handleStop}
        onTouchStart={handleStart}
        onTouchEnd={handleStop}
        className="bg-pink-900 text-white px-4 py-2 rounded hover:bg-pink-800"
      >
        Hold to Speak
      </button>
      {on && (
        <img
          className="h-10 w-[30%] object-cover contrast-150 hue-rotate-300 saturate-150"
          src="./listen.gif"
          alt="Listening"
        />
      )}
    </div>
  );
};

export default VoiceInput;
