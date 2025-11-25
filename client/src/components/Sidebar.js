import React from 'react';
import {
    FaSearch, FaList, FaClock, FaTh, FaGlobe, FaThLarge,
    FaSitemap, FaFolder, FaPencilAlt, FaTrash, FaCog, FaTrashAlt
} from 'react-icons/fa';

const Sidebar = ({
    username,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    currentList,
    setCurrentList,
    lists,
    editingListId,
    setEditingListId,
    editingListTitle,
    setEditingListTitle,
    updateList,
    startEditingList,
    deleteList,
    newListName,
    setNewListName,
    createList,
    timelineDays,
    setTimelineDays,
    setCurrentDateBase
}) => {
    return (
        <div className="sidebar">
            <div className="profile-section">
                <div className="avatar">{username.charAt(0).toUpperCase()}</div>
                <span>{username}</span>
            </div>

            <div className="search-box">
                <FaSearch className="search-icon"/>
                <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}/>
            </div>

            <div className="lists-section">
                <p className="section-title">VIEWS</p>
                <ul className="nav-list">
                    <li className={viewMode === 'list' && !currentList ? 'active' : ''} onClick={() => { setViewMode('list'); setCurrentList(null); }}>
                        <FaList style={{marginRight: 10}}/> All Tasks
                    </li>
                    <li className={viewMode === 'timeline' ? 'active' : ''} onClick={() => { setViewMode('timeline'); setCurrentDateBase(new Date()); }}>
                        <FaClock style={{marginRight: 10}}/> Timeline
                    </li>
                    <li className={viewMode === 'month' ? 'active' : ''} onClick={() => { setViewMode('month'); setCurrentDateBase(new Date()); }}>
                        <FaTh style={{marginRight: 10}}/> Month
                    </li>
                    <li className={viewMode === 'year' ? 'active' : ''} onClick={() => { setViewMode('year'); setCurrentDateBase(new Date()); }}>
                        <FaGlobe style={{marginRight: 10}}/> Year
                    </li>
                    <li className={viewMode === 'matrix' ? 'active' : ''} onClick={() => setViewMode('matrix')}>
                        <FaThLarge style={{marginRight: 10}}/> Matrix
                    </li>
                    <li className={viewMode === 'responsibility' ? 'active' : ''} onClick={() => setViewMode('responsibility')}>
                        <FaSitemap style={{marginRight: 10}}/> Responsibility
                    </li>
                </ul>

                <p className="section-title">MY LISTS</p>
                <ul className="nav-list">
                    {lists.map(l => (
                        <li key={l._id} className={`list-item ${currentList?._id === l._id ? 'active' : ''}`} onClick={() => { setCurrentList(l); setViewMode('list'); }}>
                            {editingListId === l._id ? (
                                <input
                                    type="text"
                                    value={editingListTitle}
                                    onChange={e => setEditingListTitle(e.target.value)}
                                    onBlur={() => updateList(l._id)}
                                    onKeyDown={e => { if (e.key === 'Enter') updateList(l._id) }}
                                    autoFocus
                                    className="list-edit-input"
                                    onClick={e => e.stopPropagation()}
                                />
                            ) : (
                                <>
                                    <span className="list-name"><FaFolder style={{marginRight: 10, color: l.color}}/> {l.name}</span>
                                    <div className="list-actions">
                                        <FaPencilAlt className="action-icon" onClick={(e) => { e.stopPropagation(); startEditingList(l) }}/>
                                        <FaTrash className="action-icon" onClick={(e) => { e.stopPropagation(); deleteList(l._id) }}/>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
                <div className="add-list-form">
                    <input type="text" placeholder="+ New List" value={newListName} onChange={e => setNewListName(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') createList() }}/>
                </div>
            </div>

            <ul className="nav-list bottom-nav">
                <li className={viewMode === 'trash' ? 'active' : ''} onClick={() => setViewMode('trash')}>
                    <FaTrashAlt style={{marginRight: 10}}/> Trash
                </li>
                <li className={viewMode === 'settings' ? 'active' : ''} onClick={() => setViewMode('settings')}>
                    <FaCog style={{marginRight: 10}}/> Settings
                </li>
            </ul>

            {viewMode === 'timeline' && (
                <div className="timeline-controls">
                    <div className="days-selector">
                        {[1, 3, 5, 7].map(d => (
                            <button key={d} className={timelineDays === d ? 'active' : ''} onClick={() => setTimelineDays(d)}>{d}</button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;