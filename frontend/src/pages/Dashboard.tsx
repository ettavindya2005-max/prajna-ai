import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PlusCircle, ListTodo, Users, CheckCircle, BarChart3, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalMeetings: 0, pendingTasks: 0, completedTasks: 0 });
  const [recentMeetings, setRecentMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meetingsRes, tasksRes] = await Promise.all([
          axios.get('/meetings'),
          axios.get('/tasks')
        ]);
        
        const meetings = meetingsRes.data;
        const tasks = tasksRes.data;

        setStats({
          totalMeetings: meetings.length,
          pendingTasks: tasks.filter((t: any) => t.status === 'pending' || t.status === 'in-progress').length,
          completedTasks: tasks.filter((t: any) => t.status === 'completed').length,
        });
        setRecentMeetings(meetings.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-6 py-1"><div className="h-4 bg-slate-200 rounded w-1/4"></div><div className="space-y-3"><div className="h-20 bg-slate-200 rounded"></div></div></div></div>;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back!</h1>
          <p className="text-slate-500 mt-1">Here's an overview of your recent meetings and tasks.</p>
        </div>
        <Link to="/new-meeting" className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-700 transition shadow-sm hover:shadow-md flex items-center gap-2">
          <PlusCircle className="w-5 h-5" /> Process Meeting
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-primary-200 transition-colors group">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-100 transition-colors"><BarChart3 className="w-8 h-8" /></div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Meetings</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalMeetings}</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-orange-200 transition-colors group">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-orange-50 text-orange-600 rounded-xl group-hover:bg-orange-100 transition-colors"><Clock className="w-8 h-8" /></div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Pending Tasks</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.pendingTasks}</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-200 transition-colors group">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-100 transition-colors"><CheckCircle className="w-8 h-8" /></div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Completed Tasks</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.completedTasks}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
          <Link to="/history" className="text-sm font-medium text-primary-600 hover:text-primary-700">View all</Link>
        </div>
        <div className="divide-y divide-slate-100">
          {recentMeetings.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                <ListTodo className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">No meetings processed yet.</p>
              <Link to="/new-meeting" className="text-primary-600 font-medium text-sm hover:underline mt-2 inline-block">Start by processing your first meeting</Link>
            </div>
          ) : (
            recentMeetings.map((meeting) => (
              <div key={meeting.id} className="p-6 hover:bg-slate-50 transition cursor-pointer">
                <h3 className="font-bold text-slate-900">{meeting.title}</h3>
                <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wide">{new Date(meeting.createdAt).toLocaleDateString()}</p>
                <p className="mt-3 text-sm text-slate-600 line-clamp-2 leading-relaxed">{meeting.summary}</p>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
