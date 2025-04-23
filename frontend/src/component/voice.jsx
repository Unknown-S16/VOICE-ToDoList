import React, { useRef ,useState} from 'react';
import axios from 'axios';

const VoiceInput = ({ onAdd }) => {
  const recognitionRef = useRef(null);
  const [on , setON]=useState(false);
  

  const initRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = async (event) => {
      const text = event.results[0][0].transcript;
      try {
        const res = await axios.post('http://localhost:5000/api/tasks/add', { text });
        onAdd(res.data);
      } catch (err) {
        console.error("Error saving task:", err);
      }
    };

    recognition.onerror = (e) => {
      console.error("Recognition error:", e.error);
    };

    return recognition;
  };

  const handleMouseDown = () => {
    const recognition = initRecognition();
    if (recognition) {
      recognitionRef.current = recognition;
      recognition.start();
      setON(true)
    }
  };

  const handleMouseUp = () => {
    if (recognitionRef.current) {
      setTimeout(() => {
        recognitionRef.current.stop();
        setON(false)
      }, 1000); 
    }
  };
  

  return (
    <div className='flex '>    
    <button
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600"
    >
       Hold to Speak
    </button>
    {on&&<img className='h-10 w-[30%] object-cover contrast-150 hue-rotate-300 saturate-150' src='./listen.gif'/>}    
    </div>

  );
};

export default VoiceInput;
