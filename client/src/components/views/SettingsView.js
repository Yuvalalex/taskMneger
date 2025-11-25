import React from 'react';

const SettingsView = ({
    username, defaultSettings, saveSettings, handleLogout
}) => {
    return (
        <div className="settings-container">
            <h1>Settings</h1>
            <div className="settings-section"><h3>User</h3><p>{username}</p></div>
            <div className="settings-section">
                <h3>Defaults</h3>
                <div className="modal-row">
                    <label>Default Type:</label>
                    <select value={defaultSettings.defaultType} onChange={e => saveSettings({ ...defaultSettings, defaultType: e.target.value })} className="modal-select">
                        <option value="task">Task</option>
                        <option value="event">Event</option>
                    </select>
                </div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>Log Out</button>
        </div>
    );
};

export default SettingsView;