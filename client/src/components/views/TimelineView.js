import React from 'react';
import { FaCheck, FaChevronLeft, FaChevronRight, FaExpand, FaCompress } from 'react-icons/fa';
import { getTimelineDays, isSameDate, getTopPosition, getHeight, getTasksWithLayout } from '../../utils';

const TimelineView = ({
    currentDateBase, changeDateBase, timelineDays, compactHours, setCompactHours,
    visibleTasks, handleDragOver, handleDragStart, handleDragEnd, handleTimelineDrop,
    openEditModal, openNewTaskModal, toggleTask
}) => {
    const hoursRange = compactHours ? [...Array(17)].map((_, i) => i + 7) : [...Array(24)].map((_, i) => i);
    const HOUR_HEIGHT = 60;

    return (
        <div className="timeline-container">
            <div className="view-header">
                <button onClick={() => changeDateBase(-timelineDays)}><FaChevronLeft /></button>
                <h2>{currentDateBase.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
                <button onClick={() => changeDateBase(timelineDays)}><FaChevronRight /></button>
                <button onClick={() => setCompactHours(!compactHours)}>
                    {compactHours ? <FaExpand /> : <FaCompress />}
                </button>
            </div>

            <div className="timeline-grid-wrapper">
                <div className="time-column">
                    <div className="time-label" style={{ height: 30 }}>All Day</div>
                    {hoursRange.map(h => (
                        <div key={h} className="time-label" style={{ height: HOUR_HEIGHT }}>
                            {String(h).padStart(2, '0')}:00
                        </div>
                    ))}
                </div>
                <div className="days-columns" style={{ gridTemplateColumns: `repeat(${timelineDays},1fr)` }}>
                    {getTimelineDays(currentDateBase, timelineDays).map((day, i) => (
                        <div key={i} className="day-column" onDragOver={handleDragOver} onDrop={e => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const offY = e.clientY - rect.top - 45;
                            if (offY < 0) {
                                handleTimelineDrop(e, day.toISOString().split('T')[0], null, true);
                            } else {
                                const hIdx = Math.floor(offY / HOUR_HEIGHT);
                                const actH = hoursRange[hIdx];
                                if (actH !== undefined) handleTimelineDrop(e, day.toISOString().split('T')[0], `${String(actH).padStart(2, '0')}:00`);
                            }
                        }}>
                            <div className="day-header">
                                <span>{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                <span className={`day-num ${isSameDate(day, new Date().toISOString()) ? 'today' : ''}`}>{day.getDate()}</span>
                            </div>

                            <div className="all-day-section" onDrop={e => handleTimelineDrop(e, day.toISOString().split('T')[0], null, true)}>
                                {visibleTasks.filter(t => isSameDate(day, t.dueDate) && t.isAllDay).map(t => (
                                    <div key={t._id} className={`all-day-pill ${t.tag}`} draggable="true" onDragStart={e => handleDragStart(e, t)} onDragEnd={handleDragEnd} onClick={e => { e.stopPropagation(); openEditModal(t) }}>
                                        {t.title}
                                    </div>
                                ))}
                            </div>

                            <div className="day-body" style={{ height: hoursRange.length * HOUR_HEIGHT }}>
                                {hoursRange.map(h => (
                                    <div key={h} className="hour-slot" style={{ height: HOUR_HEIGHT }} onClick={() => openNewTaskModal(day.toISOString().split('T')[0], `${String(h).padStart(2, '0')}:00`)}></div>
                                ))}
                                {getTasksWithLayout(visibleTasks.filter(t => isSameDate(day, t.dueDate) && !t.isAllDay)).map(t => {
                                    const [h] = t.startTime.split(':').map(Number);
                                    if (compactHours && (h < 7 || h > 23)) return null;
                                    return (
                                        <div key={t._id} className={`timeline-task ${t.tag} priority-${t.priority} ${t.isDone ? 'done' : ''}`}
                                            style={{ top: `${getTopPosition(t.startTime, compactHours)}px`, height: `${getHeight(t.startTime, t.endTime)}px`, ...t.style }}
                                            draggable="true" onDragStart={e => handleDragStart(e, t)} onDragEnd={handleDragEnd}
                                            onClick={e => { e.stopPropagation(); openEditModal(t) }}>
                                            {!t.isEvent && <div className="timeline-check" onClick={e => { e.stopPropagation(); toggleTask(t._id) }}>{t.isDone && <FaCheck size={8} />}</div>}
                                            <div className="task-title">{t.title}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TimelineView;