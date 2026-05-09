import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, CheckCircle, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-primary-100/50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      {/* Header */}
      <header className="px-8 py-6 flex justify-between items-center relative z-10 max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-slate-900 flex items-center gap-2 tracking-tight">
          <div className="bg-primary-600 p-1.5 rounded-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          MeetAI
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="text-slate-600 font-medium px-5 py-2 hover:text-slate-900 transition-colors">
            Log in
          </Link>
          <Link to="/signup" className="bg-slate-900 text-white px-5 py-2 rounded-xl font-medium hover:bg-slate-800 transition shadow-sm">
            Sign up free
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-8 pt-32 pb-20 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 font-medium text-sm mb-8 border border-primary-100 shadow-sm">
            <ShieldCheck className="w-4 h-4" /> Now with secure accounts & multi-user support
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8">
            Turn your meeting transcripts into <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">actionable tasks.</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Paste your notes, and let our AI instantly summarize the discussion and extract action items, assignees, and deadlines into a professional workspace.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/signup" className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-8 py-4 text-lg rounded-xl font-semibold hover:bg-primary-700 transition shadow-lg hover:shadow-xl w-full sm:w-auto">
              Get Started for Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mt-32 text-left"
        >
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Summaries</h3>
            <p className="text-slate-600 leading-relaxed">Get concise, high-quality summaries of long transcripts in seconds using advanced AI models.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative -top-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Task Extraction</h3>
            <p className="text-slate-600 leading-relaxed">Automatically pull out action items, who is responsible, and when they are due in a structured table.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
              <Bot className="w-6 h-6 text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">AI Context Search</h3>
            <p className="text-slate-600 leading-relaxed">Chat with your meeting history. Ask questions like "What tasks were assigned to Ravi this week?"</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default LandingPage;
