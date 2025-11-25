import React from 'react';
import {
    FaTimes, FaFlag, FaClock, FaTag, FaCalendarAlt, FaUser,
    FaFolder, FaStickyNote, FaPaperclip, FaTrash
} from 'react-icons/fa';

const TaskModal = ({
    editingTask,
    setEditingTask,
    saveTaskChanges,
    deleteTask,
    allUsers,
    lists,
    handleFileUpload,
    addSubtask,
    toggleSubtask,
    updateSubtaskTitle,
    removeSubtask,
    handleSubtaskKeyDown
}) => {
    if (!editingTask) return null;

    return (
        <div className="modal-overlay" onClick={() => setEditingTask(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <input
                        type="text"
                        className="modal-title-input"
                        value={editingTask.title}
                        onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                    />
                    <button className="close-btn" onClick={() => setEditingTask(null)}><FaTimes/></button>
                </div>

                <div className="modal-body">
                    <div className="type-switcher">
                        <button className={!editingTask.isEvent ? 'active' : ''} onClick={() => setEditingTask({...editingTask, isEvent: false})}>Task</button>
                        <button className={editingTask.isEvent ? 'active' : ''} onClick={() => setEditingTask({...editingTask, isEvent: true})}>Event</button>
                    </div>

                    <div className="priority-selector">
                        <label>Priority:</label>
                        {[1, 2, 3, 4].map(p => (
                            <button key={p} className={`p-btn p${p} ${editingTask.priority === p ? 'active' : ''}`} onClick={() => setEditingTask({...editingTask, priority: p})}>
                                <FaFlag/>
                            </button>
                        ))}
                    </div>

                    <div className="modal-row">
                        <label>
                            <input type="checkbox" checked={editingTask.isAllDay} onChange={e => setEditingTask({...editingTask, isAllDay: e.target.checked})}/> All Day
                        </label>
                    </div>

                    {!editingTask.isAllDay && (
                        <div className="modal-row">
                            <label><FaClock/> Time</label>
                            <div style={{display: 'flex', gap: '10px'}}>
                                <input type="time" value={editingTask.startTime} onChange={(e) => setEditingTask({...editingTask, startTime: e.target.value})} className="modal-input"/>
                                <span>to</span>
                                <input type="time" value={editingTask.endTime} onChange={(e) => setEditingTask({...editingTask, endTime: e.target.value})} className="modal-input"/>
                            </div>
                        </div>
                    )}

                    <div className="modal-row dual">
                        <div>
                            <label><FaTag/> Tag</label>
                            <select value={editingTask.tag} onChange={(e) => setEditingTask({...editingTask, tag: e.target.value})} className="modal-select">
                                <option value="General">General</option>
                                <option value="Work">Work</option>
                            </select>
                        </div>
                        <div>
                            <label><FaCalendarAlt/> Date</label>
                            <input type="date" value={editingTask.dueDate ? editingTask.dueDate.split('T')[0] : ''} onChange={(e) => setEditingTask({...editingTask, dueDate: e.target.value})} className="modal-input"/>
                        </div>
                    </div>

                    <div className="modal-row dual">
                        <div>
                            <label><FaUser/> Assignee</label>
                            <select value={editingTask.assignee || ""} onChange={e => setEditingTask({...editingTask, assignee: e.target.value})} className="modal-select">
                                <option value="">Unassigned</option>
                                {allUsers.map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                        </div>
                        <div>
                            <label><FaFolder/> List</label>
                            <select value={editingTask.list_id || ""} onChange={e => setEditingTask({...editingTask, list_id: e.target.value})} className="modal-select">
                                <option value="">None</option>
                                {lists.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="modal-row">
                        <label><FaStickyNote/> Notes</label>
                        <textarea value={editingTask.description} onChange={(e) => setEditingTask({...editingTask, description: e.target.value})} className="modal-textarea"/>
                    </div>

                    <div className="modal-row">
                        <label><FaPaperclip/> Attachments</label>
                        <input type="file" onChange={handleFileUpload} style={{color: 'white'}}/>
                        <div className="attachments-list">
                            {editingTask.attachments?.map((url, i) => (
                                <div key={i}><a href={url} target="_blank" rel="noreferrer">Attachment {i + 1}</a></div>
                            ))}
                        </div>
                    </div>

                    {!editingTask.isEvent && (
                        <div className="subtasks-section">
                            <h3>Subtasks</h3>
                            {editingTask.subtasks.map((sub, i) => (
                                <div key={i} className="subtask-row">
                                    <input type="checkbox" checked={sub.isDone} onChange={() => toggleSubtask(i)}/>
                                    <input type="text" value={sub.title} onChange={e => updateSubtaskTitle(i, e.target.value)} onKeyDown={(e) => handleSubtaskKeyDown(e)} className={sub.isDone ? 'done' : ''}/>
                                    <button onClick={() => removeSubtask(i)} className="remove-sub-btn"><FaTimes/></button>
                                </div>
                            ))}
                            <button className="add-subtask-btn" onClick={addSubtask}>+ Add Step</button>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="delete-modal-btn" onClick={() => { deleteTask(editingTask._id); setEditingTask(null); }}>
                        <FaTrash/> Delete
                    </button>
                    <button className="save-btn" onClick={saveTaskChanges}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;