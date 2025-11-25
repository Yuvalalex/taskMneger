import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Import Utilities
import { calculateEndTime } from './utils';

// Import Base Components
import Auth from './components/Auth';
import Sidebar from './components/Sidebar';
import TaskModal from './components/TaskModal';

// Import Views
import TimelineView from './components/views/TimelineView';
import MonthView from './components/views/MonthView';
import MatrixView from './components/views/MatrixView';
import ListView from './components/views/ListView';
import ResponsibilityView from './components/views/ResponsibilityView';
import YearView from './components/views/YearView';
import SettingsView from './components/views/SettingsView';

const API_URL = 'http://localhost:5001';

function App() {
  // --- STATE MANAGEMENT ---
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username') || 'User');

  // Auth State
  const [authMode, setAuthMode] = useState('login');
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Data State
  const [tasks, setTasks] = useState([]);
  const [lists, setLists] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentList, setCurrentList] = useState(null);

  // UI State
  const [newTask, setNewTask] = useState('');
  const [newListName, setNewListName] = useState('');
  const [editingListId, setEditingListId] = useState(null);
  const [editingListTitle, setEditingListTitle] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [timelineDays, setTimelineDays] = useState(3);
  const [currentDateBase, setCurrentDateBase] = useState(new Date());
  const [editingTask, setEditingTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [compactHours, setCompactHours] = useState(false);

  // Settings
  const [defaultSettings, setDefaultSettings] = useState(JSON.parse(localStorage.getItem('userSettings')) || {
    defaultTag: 'General', defaultDuration: 60, defaultType: 'task'
  });

  // --- EFFECTS ---
  useEffect(() => {
    if (token) {
      fetchTasks();
      fetchLists();
      fetchUsers();
    }
    // eslint-disable-next-line
  }, [token, viewMode]);

  // --- API CALLS ---
  const getAuthHeader = (t = token) => ({ headers: { Authorization: `Bearer ${t}` } });

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const fetchTasks = async (t = token, fetchAll = false) => {
    if (!t) return;
    try {
      const url = fetchAll || viewMode === 'responsibility' ? `${API_URL}/tasks?mode=all` : `${API_URL}/tasks`;
      const res = await axios.get(url, getAuthHeader(t));
      setTasks(res.data);
    }
    catch (e) { if (e.response?.status === 401) handleLogout(); }
  };

  const fetchLists = async () => { try { const res = await axios.get(`${API_URL}/lists`, getAuthHeader()); setLists(res.data); } catch (e) { } };
  const fetchUsers = async () => { try { const res = await axios.get(`${API_URL}/users/all`); setAllUsers(res.data); } catch (e) { } };

  // --- ACTIONS: AUTH ---
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('username', authUsername);
      fd.append('password', authPassword);
      const res = await axios.post(`${API_URL}/token`, fd);
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('username', authUsername);
      setToken(res.data.access_token);
      setUsername(authUsername);
      fetchTasks(res.data.access_token);
    } catch { setAuthError('Error'); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/register`, { username: authUsername, password: authPassword });
      handleLogin(e);
    } catch { setAuthError('Error'); }
  };

  // --- ACTIONS: TASKS ---
  const openEditModal = (task) => { setEditingTask({ ...task }); };

  const openNewTaskModal = (dateStr, timeStr) => {
    setEditingTask({
      _id: null, title: '', tag: defaultSettings.defaultTag, isEvent: defaultSettings.defaultType === 'event', isAllDay: !timeStr, priority: 4,
      dueDate: dateStr, startTime: timeStr || "09:00", endTime: timeStr ? calculateEndTime(timeStr) : "10:00",
      description: '', subtasks: [], attachments: [], list_id: currentList ? currentList._id : null
    });
  };

  const saveTaskChanges = async () => {
    if (!editingTask) return;
    try {
      const payload = { ...editingTask, isDone: editingTask.isEvent ? false : editingTask.isDone };
      if (editingTask._id) { await axios.put(`${API_URL}/tasks/${editingTask._id}/update`, payload, getAuthHeader()); }
      else { await axios.post(`${API_URL}/tasks`, payload, getAuthHeader()); }
      setEditingTask(null);
      fetchTasks(token, viewMode === 'responsibility');
    } catch (err) { console.error(err); }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`, getAuthHeader());
      fetchTasks(token, viewMode === 'responsibility');
      if (editingTask?._id === id) setEditingTask(null);
    } catch { }
  };

  const toggleTask = async (id) => { try { await axios.put(`${API_URL}/tasks/${id}`, {}, getAuthHeader()); fetchTasks(token, viewMode === 'responsibility'); } catch { } };

  const quickAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) { openNewTaskModal(new Date().toISOString().split('T')[0], "09:00"); return; }
    try {
      await axios.post(`${API_URL}/tasks`, {
        title: newTask, tag: defaultSettings.defaultTag, isEvent: defaultSettings.defaultType === 'event', priority: 4,
        dueDate: new Date().toISOString().split('T')[0], startTime: "09:00", endTime: "10:00", list_id: currentList ? currentList._id : null
      }, getAuthHeader());
      setNewTask(''); fetchTasks(token, viewMode === 'responsibility');
    } catch (err) { console.error(err); }
  };

  const handleFileUpload = async (e) => {
    if (!e.target.files[0]) return;
    const fd = new FormData(); fd.append("file", e.target.files[0]);
    try { const res = await axios.post(`${API_URL}/upload`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }); setEditingTask({ ...editingTask, attachments: [...(editingTask.attachments || []), `${API_URL}${res.data.url}`] }); } catch (err) { alert("Upload failed"); }
  };

  // --- ACTIONS: LISTS ---
  const createList = async () => { if (!newListName.trim()) return; try { const res = await axios.post(`${API_URL}/lists`, { name: newListName, owner_id: "" }, getAuthHeader()); setLists([...lists, res.data]); setNewListName(''); } catch (e) { } };
  const startEditingList = (l) => { setEditingListId(l._id); setEditingListTitle(l.name); };
  const updateList = async (id) => { if (!editingListTitle.trim()) return; try { const res = await axios.put(`${API_URL}/lists/${id}`, { name: editingListTitle, owner_id: "" }, getAuthHeader()); setLists(lists.map(l => l._id === id ? res.data : l)); setEditingListId(null); } catch (e) { } };
  const deleteList = async (id) => { if (!window.confirm("Delete list?")) return; try { await axios.delete(`${API_URL}/lists/${id}`, getAuthHeader()); setLists(lists.filter(l => l._id !== id)); if (currentList?._id === id) setCurrentList(null); fetchTasks(token, viewMode === 'responsibility'); } catch (e) { } };

  // --- HELPERS ---
  const getVisibleTasks = () => { let rel = viewMode === 'trash' ? tasks.filter(t => t.isDeleted) : tasks.filter(t => !t.isDeleted); if (currentList) rel = rel.filter(t => t.list_id === currentList._id); if (searchQuery) rel = rel.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase())); return rel; };
  const visibleTasks = getVisibleTasks();
  const saveSettings = (n) => { setDefaultSettings(n); localStorage.setItem('userSettings', JSON.stringify(n)); };
  const changeDateBase = (amt) => { const d = new Date(currentDateBase); if (viewMode === 'timeline') d.setDate(d.getDate() + amt); else if (viewMode === 'month') d.setMonth(d.getMonth() + amt); else if (viewMode === 'year') d.setFullYear(d.getFullYear() + amt); setCurrentDateBase(d); };

  // --- SUBTASKS ---
  const addSubtask = () => { setEditingTask({ ...editingTask, subtasks: [...(editingTask.subtasks || []), { title: "", isDone: false }] }); };
  const toggleSubtask = (i) => { const u = [...editingTask.subtasks]; u[i].isDone = !u[i].isDone; setEditingTask({ ...editingTask, subtasks: u }); };
  const updateSubtaskTitle = (i, v) => { const u = [...editingTask.subtasks]; u[i].title = v; setEditingTask({ ...editingTask, subtasks: u }); };
  const removeSubtask = (i) => { const u = [...editingTask.subtasks]; u.splice(i, 1); setEditingTask({ ...editingTask, subtasks: u }); };
  const handleSubtaskKeyDown = (e) => { if (e.key === 'Enter') { e.preventDefault(); addSubtask(); } };

  // --- DRAG AND DROP ---
  const handleDragStart = (e, task) => { setDraggedTask(task); e.dataTransfer.effectAllowed = "move"; e.target.style.opacity = '0.5'; };
  const handleDragEnd = (e) => { e.target.style.opacity = '1'; setDraggedTask(null); };
  const handleDragOver = (e) => e.preventDefault();

  const handleTimelineDrop = async (e, dateStr, timeStr, isAllDayDrop = false) => {
    e.preventDefault();
    if (!draggedTask) return;
    let u = { ...draggedTask, dueDate: dateStr };
    if (isAllDayDrop) {
      u.isAllDay = true;
    } else {
      u.isAllDay = false;
      if (timeStr) {
        const [h1, m1] = draggedTask.startTime.split(':').map(Number);
        const [h2, m2] = draggedTask.endTime.split(':').map(Number);
        const dur = (h2 * 60 + m2) - (h1 * 60 + m1);
        const [nH, nM] = timeStr.split(':').map(Number);
        const endMins = nH * 60 + nM + dur;
        u.startTime = timeStr;
        u.endTime = `${String(Math.floor(endMins / 60)).padStart(2, '0')}:${String(endMins % 60).padStart(2, '0')}`;
      }
    }
    setTasks(tasks.map(t => t._id === draggedTask._id ? u : t));
    try { await axios.put(`${API_URL}/tasks/${draggedTask._id}/update`, u, getAuthHeader()); }
    catch { fetchTasks(token, viewMode === 'responsibility'); }
  };

  const handleMatrixDrop = async (e, pri) => { e.preventDefault(); if (!draggedTask) return; const u = { ...draggedTask, priority: pri }; setTasks(tasks.map(t => t._id === draggedTask._id ? u : t)); try { await axios.put(`${API_URL}/tasks/${draggedTask._id}/update`, u, getAuthHeader()); } catch { fetchTasks(token, viewMode === 'responsibility'); } };
  const handleResponsibilityDrop = async (e, assigneeName) => { e.preventDefault(); if (!draggedTask) return; const u = { ...draggedTask, assignee: assigneeName }; setTasks(tasks.map(t => t._id === draggedTask._id ? u : t)); try { await axios.put(`${API_URL}/tasks/${draggedTask._id}/update`, u, getAuthHeader()); } catch { fetchTasks(token, viewMode === 'responsibility'); } };

  // --- RENDER ---
  if (!token) return (
    <Auth
      authMode={authMode} setAuthMode={setAuthMode}
      authUsername={authUsername} setAuthUsername={setAuthUsername}
      authPassword={authPassword} setAuthPassword={setAuthPassword}
      handleLogin={handleLogin} handleRegister={handleRegister}
      authError={authError}
    />
  );

  return (
    <div className="app-container">
      <Sidebar
        username={username}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        viewMode={viewMode} setViewMode={setViewMode}
        currentList={currentList} setCurrentList={setCurrentList}
        lists={lists}
        editingListId={editingListId} setEditingListId={setEditingListId}
        editingListTitle={editingListTitle} setEditingListTitle={setEditingListTitle}
        updateList={updateList} startEditingList={startEditingList} deleteList={deleteList}
        newListName={newListName} setNewListName={setNewListName} createList={createList}
        timelineDays={timelineDays} setTimelineDays={setTimelineDays}
        setCurrentDateBase={setCurrentDateBase}
      />

      <div className="main-content">

        {viewMode === 'responsibility' && (
          <ResponsibilityView
            allUsers={allUsers}
            visibleTasks={visibleTasks}
            handleDragOver={handleDragOver}
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
            handleResponsibilityDrop={handleResponsibilityDrop}
            toggleTask={toggleTask}
            openEditModal={openEditModal}
          />
        )}

        {viewMode === 'year' && (
          <YearView
            currentDateBase={currentDateBase}
            changeDateBase={changeDateBase}
            visibleTasks={visibleTasks}
          />
        )}

        {(viewMode === 'timeline' || viewMode === 'month') && viewMode === 'timeline' ? (
           <TimelineView
              currentDateBase={currentDateBase}
              changeDateBase={changeDateBase}
              timelineDays={timelineDays}
              compactHours={compactHours}
              setCompactHours={setCompactHours}
              visibleTasks={visibleTasks}
              handleDragOver={handleDragOver}
              handleDragStart={handleDragStart}
              handleDragEnd={handleDragEnd}
              handleTimelineDrop={handleTimelineDrop}
              openEditModal={openEditModal}
              openNewTaskModal={openNewTaskModal}
              toggleTask={toggleTask}
           />
        ) : viewMode === 'month' ? (
           <MonthView
              currentDateBase={currentDateBase}
              changeDateBase={changeDateBase}
              visibleTasks={visibleTasks}
              handleDragOver={handleDragOver}
              handleDragStart={handleDragStart}
              handleDragEnd={handleDragEnd}
              handleTimelineDrop={handleTimelineDrop}
              openEditModal={openEditModal}
              openNewTaskModal={openNewTaskModal}
           />
        ) : null}

        {viewMode === 'matrix' && (
          <MatrixView
            visibleTasks={visibleTasks}
            handleDragOver={handleDragOver}
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
            handleMatrixDrop={handleMatrixDrop}
            openEditModal={openEditModal}
            toggleTask={toggleTask}
          />
        )}

        {viewMode === 'settings' && (
          <SettingsView
            username={username}
            defaultSettings={defaultSettings}
            saveSettings={saveSettings}
            handleLogout={handleLogout}
          />
        )}

        {(viewMode === 'list' || viewMode === 'trash') && (
          <ListView
            viewMode={viewMode}
            visibleTasks={visibleTasks}
            currentList={currentList}
            newTask={newTask}
            setNewTask={setNewTask}
            quickAddTask={quickAddTask}
            deleteTask={deleteTask}
            toggleTask={toggleTask}
            openEditModal={openEditModal}
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
          />
        )}

      </div>

      <TaskModal
        editingTask={editingTask}
        setEditingTask={setEditingTask}
        saveTaskChanges={saveTaskChanges}
        deleteTask={deleteTask}
        allUsers={allUsers}
        lists={lists}
        handleFileUpload={handleFileUpload}
        addSubtask={addSubtask}
        toggleSubtask={toggleSubtask}
        updateSubtaskTitle={updateSubtaskTitle}
        removeSubtask={removeSubtask}
        handleSubtaskKeyDown={handleSubtaskKeyDown}
      />
    </div>
  );
}

export default App;