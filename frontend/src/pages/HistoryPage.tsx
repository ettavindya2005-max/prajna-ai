import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HistoryPage = () => {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get('/meetings');
        setMeetings(response.data);
      } catch (error) {
        console.error("Failed to fetch meetings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMeetings();
  }, []);

  const filteredMeetings = meetings.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Meeting History</h1>
          <p className="text-slate-500 mt-1">Review summaries and tasks from past meetings.</p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search meetings..."
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm shadow-sm"
          />
        </div>
      </div>
      
      {loading ? (
        <div className="text-center text-slate-500 py-10">Loading history...</div>
      ) : filteredMeetings.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center text-slate-500 border border-slate-200 shadow-sm">
          No meetings found.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMeetings.map((meeting) => (
            <div key={meeting.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:border-slate-300">
              <div 
                className="p-5 cursor-pointer bg-white hover:bg-slate-50 transition-colors flex justify-between items-center"
                onClick={() => setExpanded(expanded === meeting.id ? null : meeting.id)}
              >
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{meeting.title}</h3>
                  <div className="flex items-center text-xs font-medium text-slate-500 mt-1.5 gap-1.5 uppercase tracking-wide">
                    <Calendar className="w-4 h-4" />
                    {new Date(meeting.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="p-2 bg-slate-50 rounded-full text-slate-400">
                  {expanded === meeting.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>
              
              <AnimatePresence>
                {expanded === meeting.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-100 bg-slate-50/50 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="mb-8">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">AI Summary</h4>
                        <p className="text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-100 shadow-sm">{meeting.summary}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                          Extracted Tasks 
                          <span className="bg-primary-100 text-primary-700 py-0.5 px-2 rounded-full text-xs">{meeting.tasks?.length || 0}</span>
                        </h4>
                        {meeting.tasks && meeting.tasks.length > 0 ? (
                          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                            <ul className="divide-y divide-slate-100">
                              {meeting.tasks.map((task: any) => (
                                <li key={task.id} className="p-4 flex items-start gap-3">
                                  <div className="mt-0.5 w-4 h-4 rounded-full border-2 border-slate-300 flex-shrink-0"></div>
                                  <div>
                                    <p className="font-medium text-slate-900 text-sm">{task.description}</p>
                                    <div className="flex gap-3 mt-1 text-xs text-slate-500">
                                      <span>Assigned: <strong className="text-slate-700">{task.assignee}</strong></span>
                                      {task.deadline && task.deadline !== 'null' && <span>Due: <strong className="text-slate-700">{task.deadline}</strong></span>}
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <p className="text-slate-500 text-sm italic">No tasks were extracted from this meeting.</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default HistoryPage;
