import { pool } from '../config/database_conn.js';
import { Users } from '../models/users.js'

export const UsersRepository = {
    findAll: async () => {
        const result = await pool.query(
            `
            SELECT u.*, array_remove(array_agg(ur.role_id), NULL) AS roles 
            FROM users u 
            LEFT JOIN users_roles ur
            ON u.id = ur.user_id 
            GROUP BY u.id
            ORDER BY created_at DESC;
            `
        );
        

        return Users.fromArray(result.rows);
    },

    findById: async (id) => {
        const selectIdQuery = 
        `
        SELECT u.*, array_remove(array_agg(ur.role_id), NULL) AS roles
        FROM users u
        LEFT JOIN users_roles ur
        ON u.id = ur.user_id
        WHERE u.id = $1
        GROUP BY u.id;
        `

        const result = await pool.query(selectIdQuery, [id]);

        return new Users(result.rows[0]);
    },

    create: async(userData) =>{
        const insertUserQuery = 
        `
        INSERT INTO users
        (name, matricula, email, profile, pending)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
        `;

        const values = [
            userData.name,
            userData.matricula,
            userData.email,
            userData.profile,
            userData.pending=false
        ];
        
        const userDB = await pool.query(insertUserQuery, values);

        const insertUserRoleQuery = `INSERT INTO users_roles (user_id, role_id) VALUES ($1, $2)`;

        for (const roleId of userData.roles){
            await pool.query(insertUserRoleQuery, [userDB.rows[0].id, roleId])
        }

        const userWithRolesQuery =
        `
        SELECT u.*, array_remove(array_agg(ur.role_id), NULL) AS roles
        FROM users u
        LEFT JOIN users_roles ur
        ON u.id = ur.user_id
        WHERE u.id = $1
        GROUP BY u.id;
        `;

        const result = await pool.query(userWithRolesQuery, [userDB.rows[0].id]);
        
        return new Users(result.rows[0]);
    }
};