import { pool } from '../config/database_conn.js';

export const RoleRepository = {
    findAll: async () =>{
        const result = await pool.query(
            `
            SELECT * FROM roles
            ORDER BY created_at DESC;
            `
        );
        return result.rows;
    },

    create: async(roleData) =>{
        const insertRoleQuery = 
        `
        INSERT INTO roles
        (name, color, description)
        VALUES ($1, $2, $3)
        RETURNING *;
        `;

        const values = [
            roleData.name,
            roleData.color,
            roleData.description
        ];
        
        const roleDB = await pool.query(insertRoleQuery, values);

        return roleDB.rows[0];
    }
};