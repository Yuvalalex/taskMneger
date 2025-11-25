import React from 'react';
import { FaUser, FaCheck } from 'react-icons/fa';

const ResponsibilityView = ({
    allUsers, visibleTasks, handleDragOver, handleDragStart, handleDragEnd, handleResponsibilityDrop,
    toggleTask, openEditModal
}) => {
    return (
        <div className="responsibility-container">
            <h1>Responsibility Tree</h1>
            <div className="resp-grid">
                {/* Unassigned Column */}
                <div className="resp-column" onDragOver={handleDragOver} onDrop={(e) => handleResponsibilityDrop(e, null)}>
                    <div className="resp-header"><FaUser /> Unassigned</div>
                    <div className="resp-body">
                        {visibleTasks.filter(t => !t.assignee).map(t => (
                            <div key={t._id} className={`task-item ${t.isEvent ? 'event-item' : ''} ${t.isDeleted ? 'deleted-item' : ''} priority-${t.priority} ${t.isDone ? 'done' : ''}`}
                                draggable="true" onDragStart={e => handleDragStart(e, t)} onDragEnd={handleDragEnd}
                                onClick={() => openEditModal(t)}>
                                {!t.isEvent && <div className="checkbox" onClick={e => { e.stopPropagation(); toggleTask(t._id) }}>{t.isDone && <FaCheck size={10} />}</div>}
                                <div className="task-content"><span className="task-text">{t.title}</span></div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* User Columns */}
                {allUsers.map(u => (
                    <div key={u} className="resp-column" onDragOver={handleDragOver} onDrop={(e) => handleResponsibilityDrop(e, u)}>
                        <div className="resp-header"><div className="user-badge">{u.charAt(0).toUpperCase()}</div> {u}</div>
                        <div className="resp-body">
                            {visibleTasks.filter(t => t.assignee === u).map(t => (
                                <div key={t._id} className={`task-item ${t.isEvent ? 'event-item' : ''} ${t.isDeleted ? 'deleted-item' : ''} priority-${t.priority} ${t.isDone ? 'done' : ''}`}
                                    draggable="true" onDragStart={e => handleDragStart(e, t)} onDragEnd={handleDragEnd}
                                    onClick={() => openEditModal(t)}>
                                    {!t.isEvent && <div className="checkbox" onClick={e => { e.stopPropagation(); toggleTask(t._id) }}>{t.isDone && <FaCheck size={10} />}</div>}
                                    <div className="task-content">
                                        <span className="task-text">{t.title}</span>
                                        <span className="due-tiny" style={{ fontSize: 10, color: '#888' }}>{t.dueDate?.split('T')[0]}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResponsibilityView;