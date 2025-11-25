import React from 'react';
import { FaCheck } from 'react-icons/fa';

const MatrixView = ({
    visibleTasks, handleDragOver, handleDragStart, handleDragEnd, handleMatrixDrop,
    openEditModal, toggleTask
}) => {
    return (
        <div className="matrix-container">
            {[1, 2, 3, 4].map(p => (
                <div key={p} className={`matrix-quadrant q${p}`} onDragOver={handleDragOver} onDrop={e => handleMatrixDrop(e, p)}>
                    <div className="quadrant-header">Priority {p}</div>
                    <div className="quadrant-list">
                        {visibleTasks.filter(t => t.priority === p).map(t => (
                            <div key={t._id} className={`matrix-task-item ${t.isDone ? 'done' : ''}`}
                                draggable="true" onDragStart={e => handleDragStart(e, t)} onDragEnd={handleDragEnd}
                                onClick={() => openEditModal(t)}>
                                <div className="matrix-check" onClick={e => { e.stopPropagation(); toggleTask(t._id) }}>
                                    {t.isDone && <FaCheck size={10} />}
                                </div>
                                <span className="task-text">{t.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MatrixView;