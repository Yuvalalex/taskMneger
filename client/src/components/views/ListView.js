import React from 'react';
import { FaPlus, FaCheck, FaTimes, FaTrash } from 'react-icons/fa';

const ListView = ({
    visibleTasks, viewMode, currentList, newTask, setNewTask,
    quickAddTask, deleteTask, toggleTask, openEditModal, handleDragStart, handleDragEnd
}) => {
    return (
        <>
            <div className="list-header-row">
                <h1>{viewMode === 'trash' ? 'Trash' : currentList ? currentList.name : 'All Tasks'}</h1>
            </div>
            {viewMode === 'list' && (
                <form onSubmit={quickAddTask} className="input-group">
                    <input type="text" placeholder="Add task..." value={newTask} onChange={e => setNewTask(e.target.value)} />
                    <button className="add-btn"><FaPlus /></button>
                </form>
            )}
            <div className="task-list">
                {visibleTasks.map(t => (
                    <div key={t._id} className={`task-item ${t.isEvent ? 'event-item' : ''} ${t.isDeleted ? 'deleted-item' : ''} priority-${t.priority} ${t.isDone ? 'done' : ''}`}
                        draggable="true" onDragStart={e => handleDragStart(e, t)} onDragEnd={handleDragEnd}
                        onClick={() => openEditModal(t)}>
                        {!t.isEvent && !t.isDeleted && (
                            <div className="checkbox" onClick={e => { e.stopPropagation(); toggleTask(t._id) }}>
                                {t.isDone && <FaCheck />}
                            </div>
                        )}
                        <span className="task-text">{t.title}</span>
                        {t.isDeleted ?
                            <button className="delete-btn" onClick={e => { e.stopPropagation(); deleteTask(t._id) }}><FaTimes /></button> :
                            <button className="delete-btn" onClick={e => { e.stopPropagation(); deleteTask(t._id) }}><FaTrash /></button>
                        }
                    </div>
                ))}
            </div>
        </>
    );
};

export default ListView;