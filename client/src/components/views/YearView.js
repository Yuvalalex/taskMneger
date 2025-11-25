import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getYearMonths, getDaysInMonth, isSameDate } from '../../utils';

const YearView = ({
    currentDateBase, changeDateBase, visibleTasks
}) => {
    return (
        <div className="year-container">
            <div className="view-header">
                <button onClick={() => changeDateBase(-1)}><FaChevronLeft /></button>
                <h2>{currentDateBase.getFullYear()}</h2>
                <button onClick={() => changeDateBase(1)}><FaChevronRight /></button>
            </div>
            <div className="year-grid">
                {getYearMonths(currentDateBase).map((mDate, i) => (
                    <div key={i} className="mini-month">
                        <h4>{mDate.toLocaleDateString('en-US', { month: 'long' })}</h4>
                        <div className="mini-month-days">
                            {[...Array(new Date(mDate.getFullYear(), mDate.getMonth(), 1).getDay())].map((_, x) => <div key={`e-${x}`}></div>)}
                            {[...Array(getDaysInMonth(mDate))].map((_, d) => {
                                const dNum = d + 1;
                                const dateStr = `${mDate.getFullYear()}-${String(mDate.getMonth() + 1).padStart(2, '0')}-${String(dNum).padStart(2, '0')}`;
                                const hasTask = visibleTasks.some(t => isSameDate(new Date(dateStr), t.dueDate));
                                return <div key={d} className={`mini-day ${hasTask ? 'has-task' : ''}`}>{dNum}</div>
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default YearView;