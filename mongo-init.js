// Initialize MongoDB database and create application database
db = db.getSiblingDB('taskmanager');

// Create application database with collections
db.createCollection('users');
db.createCollection('tasks');
db.createCollection('lists');

// Create indexes for better performance
db.users.createIndex({ username: 1 }, { unique: true });
db.tasks.createIndex({ owner_id: 1 });
db.tasks.createIndex({ owner_id: 1, list_id: 1 });
db.tasks.createIndex({ owner_id: 1, isDeleted: 1 });
db.lists.createIndex({ owner_id: 1 });

print('Database initialized successfully');
