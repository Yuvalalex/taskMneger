import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getMonthDays, isSameDate } from '../../utils';

const MonthView = ({
    currentDateBase, changeDateBase, visibleTasks,
    handleDragOver, handleDragStart, handleDragEnd, handleTimelineDrop,
    openEditModal, openNewTaskModal
}) => {
    return (
        <>
            <div className="view-header">
                <button onClick={() => changeDateBase(-1)}><FaChevronLeft /></button>
                <h2>{currentDateBase.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
                <button onClick={() => changeDateBase(1)}><FaChevronRight /></button>
            </div>
            <div className="month-grid">
                <div className="weekdays-row"><div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div></div>
                <div className="month-days">
                    {getMonthDays(currentDateBase).map((day, i) => (
                        <div key={i} className={`month-day ${!day ? 'empty' : ''}`}
                            onDragOver={handleDragOver}
                            onDrop={e => day && handleTimelineDrop(e, day.toISOString().split('T')[0], "09:00")}
                            onClick={() => day && openNewTaskModal(day.toISOString().split('T')[0], "09:00")}>
                            {day && <div className="day-number">{day.getDate()}</div>}
                            {day && <div className="day-tasks-list">
                                {visibleTasks.filter(t => isSameDate(day, t.dueDate)).map(t => (
                                    <div key={t._id} className={`month-task-pill ${t.tag} ${t.isEvent ? 'event' : ''} priority-${t.priority}`}
                                        draggable="true" onDragStart={e => handleDragStart(e, t)} onDragEnd={handleDragEnd}
                                        onClick={e => { e.stopPropagation(); openEditModal(t); }}>
                                        <span>{t.title}</span>
                                    </div>
                                ))}
                            </div>}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default MonthView;