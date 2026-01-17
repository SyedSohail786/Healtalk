// server.js
const app = require('./app');
const http = require('http');
const initializeSocket = require('./middleware/socket');
const db = require('./config/db');
const bcrypt = require('bcrypt');

const server = http.createServer(app);

// Initialize Socket.io
const io = initializeSocket(server);

// Make io accessible to routes if needed
app.set('io', io);

// Function to create/update admin user
const setupAdminUser = async () => {
    try {
        const adminEmail = 'admin@email.com';
        const adminPassword = 'admin@123';
        const adminName = 'System Administrator';
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        
        // Check if admin exists
        db.query('SELECT user_id FROM users WHERE email = ?', [adminEmail], (err, results) => {
            if (err) {
                console.error('Error checking admin user:', err);
                return;
            }
            
            if (results.length === 0) {
                // Create new admin user
                db.query(
                    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                    [adminName, adminEmail, hashedPassword],
                    (err, userResult) => {
                        if (err) {
                            console.error('Error creating admin user:', err);
                            return;
                        }
                        
                        const userId = userResult.insertId;
                        
                        // Assign admin role
                        db.query(
                            'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
                            [userId, 3],
                            (err) => {
                                if (err) {
                                    console.error('Error assigning admin role:', err);
                                    return;
                                }
                                
                                console.log('✅ Admin user created successfully');
                                console.log('   Email: admin@email.com');
                                console.log('   Password: admin@123');
                            }
                        );
                    }
                );
            } else {
                // Update existing admin user with correct password
                const userId = results[0].user_id;
                
                // Update password
                db.query(
                    'UPDATE users SET password = ? WHERE user_id = ?',
                    [hashedPassword, userId],
                    (err) => {
                        if (err) {
                            console.error('Error updating admin password:', err);
                            return;
                        }
                        
                        // Ensure admin role is assigned
                        db.query(
                            'INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (?, ?)',
                            [userId, 3],
                            (err) => {
                                if (err) {
                                    console.error('Error ensuring admin role:', err);
                                    return;
                                }
                                
                                console.log('✅ Admin user verified and updated');
                                console.log('   Email: admin@email.com');
                                console.log('   Password: admin@123');
                            }
                        );
                    }
                );
            }
        });
    } catch (error) {
        console.error('Error in setupAdminUser:', error);
    }
};

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`⚡ WebSocket server ready on port ${PORT}`);
    
    // Setup admin user on server start
    setupAdminUser();
});