import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FileText, Loader2, Sparkles, Mic, Square } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const MeetingInput = () => {
  const [title, setTitle] = useState('');
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
        }
        if (currentTranscript) {
          setTranscript((prev) => prev + currentTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
          toast.error("Microphone access denied. Please allow microphone permissions.");
          setIsRecording(false);
        }
      };

      recognitionRef.current.onend = () => {
        // If it stops automatically but we still want to record, restart it
        // However, we'll just let the state control it via the button to avoid infinite loops
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      toast.success("Stopped recording");
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        toast.success("Recording started... Start speaking!");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcript.trim()) {
      toast.error('Transcript is required');
      return;
    }

    // Stop recording if running
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    setLoading(true);

    try {
      await axios.post('/meetings', { title, transcript });
      toast.success('Meeting processed successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to process transcript.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <div className="bg-primary-100 p-2 rounded-xl">
                <FileText className="text-primary-600 w-6 h-6" />
              </div>
              Process New Meeting
            </h1>
            <p className="text-slate-500 mt-2 sm:ml-11">Record your meeting live, or paste notes to generate tasks.</p>
          </div>

          <button
            type="button"
            onClick={toggleRecording}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm ${
              isRecording 
                ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 shadow-red-100 animate-pulse' 
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isRecording ? (
              <>
                <Square className="w-5 h-5 fill-current" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 text-primary-600" />
                Start Live Transcription
              </>
            )}
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div>
            <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider mb-2">Meeting Title <span className="text-slate-400 font-normal capitalize">(Optional)</span></label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Weekly Sync with Marketing Team"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all shadow-sm text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-2">
              Transcript / Notes
              {isRecording && <span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>}
            </label>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={12}
              placeholder="Click 'Start Live Transcription' above to record automatically, or paste the raw text of your meeting here..."
              className={`w-full px-4 py-4 border rounded-xl outline-none transition-all resize-none font-mono text-sm shadow-sm ${
                isRecording ? 'border-red-300 ring-2 ring-red-100 bg-red-50/10' : 'border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              }`}
              required
            ></textarea>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading || !transcript.trim()}
              className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-primary-400" />
                  Generate Summary & Tasks
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default MeetingInput;
