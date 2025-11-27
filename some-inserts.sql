-- ======================================
-- Tabela roles (5 registros)
-- ======================================
INSERT INTO roles (name, color, description) VALUES
('Administrador', '#FF5733', 'Responsável pela administração geral do sistema'),
('Supervisor', '#33C4FF', 'Supervisiona equipes e processos críticos'),
('Operador', '#4CAF50', 'Operador de sistemas e monitoramento'),
('Analista', '#FFC107', 'Analista de suporte técnico'),
('Gerente', '#9C27B0', 'Gerente de operações e TI');

-- ======================================
-- Tabela users (5 registros)
-- ======================================
INSERT INTO users (firebase_id, name, matricula, email, phone, picture, profile, pending) VALUES
('24Iq9mjTDEg5YAZzYnKfzbYjGAj2', 'João Martins', 'MAT001', 'admin@admin.com', '11999998888', null, 'admin', false),
(null, 'Maria Santos', 'MAT002', 'maria@example.com', '11988887777', null, 'operator', true),
('w01o7nM3fwPPxgEiZNkkClRVm8B3', 'Penkas Peikson', 'MAT003', 'penkas@example.com', '11977776666', null, 'viewer', false),
(null , 'Ana Oliveira', 'MAT004', 'ana@example.com', '11966665555', null, 'viewer', true),
('Gr4tkjp57IXCoRnZwHaLG8Pas3w2', 'Rogerio Oliveira', 'MAT005', 'rogerio@example.com', '11955554444', null, 'operator', false);

-- ======================================
-- Tabela users_roles (5 registros)
-- ======================================
INSERT INTO users_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.email='admin@admin.com' AND r.name='Administrador';

INSERT INTO users_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.email='penkas@example.com' AND r.name='Supervisor';

INSERT INTO users_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.email='rogerio@example.com' AND r.name='Analista';

-- ======================================
-- Tabela user_preferences (5 registros)
-- ======================================
INSERT INTO user_preferences (user_id, dnd_start_time, dnd_end_time)
SELECT id, '22:00:00', '07:00:00' FROM users WHERE email = 'admin@admin.com';

INSERT INTO user_preferences (user_id, dnd_start_time, dnd_end_time) 
SELECT id, '21:30:00', '06:30:00' FROM users WHERE email = 'penkas@example.com';

INSERT INTO user_preferences (user_id, dnd_start_time, dnd_end_time) 
SELECT id, '00:00:00', '06:00:00' FROM users WHERE email = 'rogerio@example.com';

-- ======================================
-- Tabela channels (5 registros)
-- ======================================
INSERT INTO channels (type, name, config, is_active) VALUES
('EMAIL', 'Email Corporativo', '{"smtp_server": "smtp.qqtech.com", "port": 587}', true),
('COMUNIQ', 'ComunIQ', '{"api_key": "abcd1234efgh5678", "channel_id": "support-alerts"}', true),
('PUSH', 'Notificação Push', '{"firebase_topic": "incidents"}', true),
('PUSH SOUND', 'Push Sound', '{"webhook_url": "https://hooks.slack.com/services/xxx"}', true);

-- ======================================
-- Tabela user_preferences_channels (5 registros)
-- ======================================
INSERT INTO user_preferences_channels (user_preferences_id, channel_id)
SELECT up.id, c.id FROM user_preferences up, channels c
WHERE up.user_id = (SELECT id FROM users WHERE email='admin@admin.com' LIMIT 1)
AND c.type IN ('PUSH','EMAIL');

INSERT INTO user_preferences_channels (user_preferences_id, channel_id)
SELECT up.id, c.id FROM user_preferences up, channels c
WHERE up.user_id=(SELECT id FROM users WHERE email='penkas@example.com' LIMIT 1)
AND c.type='EMAIL';

INSERT INTO user_preferences_channels (user_preferences_id, channel_id)
SELECT up.id, c.id FROM user_preferences up, channels c
WHERE up.user_id=(SELECT id FROM users WHERE email='rogerio@example.com' LIMIT 1)
AND c.type='COMUNIQ';

-- ======================================
-- Tabela rules (5 registros)
-- ======================================
INSERT INTO rules (name, description, database_type, sql, priority, execution_interval_ms, max_error_count, timeout_ms, start_time, end_time, notification_enabled, is_active, silence_mode, user_creator_id) VALUES
('Verificar CPU Alta', 'Monitora uso de CPU acima de 80%', 'POSTGRESQL', 'SELECT * FROM system_metrics WHERE cpu_usage > 80', 'HIGH', 60000, 3, 5000, '00:00:00', '23:59:59', true, true, false, (SELECT id FROM users WHERE email = 'admin@admin.com' LIMIT 1)),
('Verificar Memória', 'Monitora uso de memória acima de 90%', 'POSTGRESQL', 'SELECT * FROM system_metrics WHERE memory_usage > 90', 'CRITICAL', 30000, 5, 5000, '00:00:00', '23:59:59', true, true, false, (SELECT id FROM users WHERE email = 'admin@admin.com' LIMIT 1)),
('Verificar Disco Cheio', 'Monitora espaço em disco abaixo de 10%', 'POSTGRESQL', 'SELECT * FROM system_metrics WHERE disk_free < 10', 'MEDIUM', 120000, 3, 5000, '06:00:00', '22:00:00', true, true, false, (SELECT id FROM users WHERE email = 'penkas@example.com' LIMIT 1)),
('Verificar Conexões BD', 'Monitora conexões ativas no banco de dados', 'POSTGRESQL', 'SELECT count(*) FROM pg_stat_activity WHERE state = ''active''', 'LOW', 180000, 2, 3000, '00:00:00', '23:59:59', true, true, false, (SELECT id FROM users WHERE email = 'rogerio@example.com' LIMIT 1)),
('Verificar Logs de Erro', 'Monitora logs de erro críticos', 'POSTGRESQL', 'SELECT * FROM application_logs WHERE level = ''ERROR'' AND created_at > NOW() - INTERVAL ''5 minutes''', 'HIGH', 90000, 4, 8000, '00:00:00', '23:59:59', true, false, false, (SELECT id FROM users WHERE email = 'maria.santos@qqtech.com' LIMIT 1));

-- ======================================
-- Tabela rules_roles (5 registros)
-- ======================================
INSERT INTO rules_roles (rule_id, role_id)
SELECT r.id, ro.id FROM rules r, roles ro WHERE r.name = 'Verificar CPU Alta' AND ro.name = 'Administrador';

INSERT INTO rules_roles (rule_id, role_id)
SELECT r.id, ro.id FROM rules r, roles ro WHERE r.name = 'Verificar Memória' AND ro.name = 'Supervisor';

INSERT INTO rules_roles (rule_id, role_id)
SELECT r.id, ro.id FROM rules r, roles ro WHERE r.name = 'Verificar Disco Cheio' AND ro.name = 'Operador';

INSERT INTO rules_roles (rule_id, role_id)
SELECT r.id, ro.id FROM rules r, roles ro WHERE r.name = 'Verificar Conexões BD' AND ro.name = 'Analista';

INSERT INTO rules_roles (rule_id, role_id)
SELECT r.id, ro.id FROM rules r, roles ro WHERE r.name = 'Verificar Logs de Erro' AND ro.name = 'Gerente';

-- ======================================
-- Tabela runners (5 registros)
-- ======================================
INSERT INTO runners (rule_id, status, last_run_at) VALUES
((SELECT id FROM rules WHERE name = 'Verificar CPU Alta' LIMIT 1), 'IDLE', '2025-11-27 10:30:00'),
((SELECT id FROM rules WHERE name = 'Verificar Memória' LIMIT 1), 'RUNNING', '2025-11-27 11:45:00'),
((SELECT id FROM rules WHERE name = 'Verificar Disco Cheio' LIMIT 1), 'COMPLETED', '2025-11-27 09:15:00'),
((SELECT id FROM rules WHERE name = 'Verificar Conexões BD' LIMIT 1), 'SCHEDULED', '2025-11-27 08:00:00'),
((SELECT id FROM rules WHERE name = 'Verificar Logs de Erro' LIMIT 1), 'FAILED', '2025-11-27 07:20:00');

-- ======================================
-- Tabela runner_queue (5 registros)
-- ======================================
INSERT INTO runner_queue (runner_id, status, scheduled_for, queued_at, started_at, finished_at, attempt_count) VALUES
((SELECT id FROM runners WHERE rule_id = (SELECT id FROM rules WHERE name = 'Verificar CPU Alta' LIMIT 1) LIMIT 1), 'COMPLETED', '2025-11-27 10:30:00', '2025-11-27 10:30:05', '2025-11-27 10:30:10', '2025-11-27 10:30:15', 1),
((SELECT id FROM runners WHERE rule_id = (SELECT id FROM rules WHERE name = 'Verificar Memória' LIMIT 1) LIMIT 1), 'PROCESSING', '2025-11-27 11:45:00', '2025-11-27 11:45:03', '2025-11-27 11:45:08', NULL, 1),
((SELECT id FROM runners WHERE rule_id = (SELECT id FROM rules WHERE name = 'Verificar Disco Cheio' LIMIT 1) LIMIT 1), 'COMPLETED', '2025-11-27 09:15:00', '2025-11-27 09:15:02', '2025-11-27 09:15:05', '2025-11-27 09:15:12', 1),
((SELECT id FROM runners WHERE rule_id = (SELECT id FROM rules WHERE name = 'Verificar Conexões BD' LIMIT 1) LIMIT 1), 'PENDING', '2025-11-27 12:00:00', '2025-11-27 11:59:55', NULL, NULL, 0),
((SELECT id FROM runners WHERE rule_id = (SELECT id FROM rules WHERE name = 'Verificar Logs de Erro' LIMIT 1) LIMIT 1), 'FAILED', '2025-11-27 07:20:00', '2025-11-27 07:20:02', '2025-11-27 07:20:05', '2025-11-27 07:20:08', 3);

-- ======================================
-- Tabela runner_logs (5 registros)
-- ======================================
INSERT INTO runner_logs (runner_id, queue_id, run_time_ms, execution_status, rows_affected, result, error, executed_at) VALUES
((SELECT id FROM runners WHERE rule_id = (SELECT id FROM rules WHERE name = 'Verificar CPU Alta' LIMIT 1) LIMIT 1),
 (SELECT id FROM runner_queue WHERE runner_id = (SELECT id FROM runners WHERE rule_id = (SELECT id FROM rules WHERE name = 'Verificar CPU Alta' LIMIT 1) LIMIT 1) AND scheduled_for = '2025-11-27 10:30:00' LIMIT 1),
 1250, 'SUCCESS', 3, '3 registros encontrados com CPU alta', NULL, '2025-11-27 10:30:15'),
((SELECT id FROM runners WHERE rule_id = (SELECT id FROM rules WHERE name = 'Verificar Memória' LIMIT 1) LIMIT 1),
 (SELECT id FROM runner_queue WHERE runner_id = (SELECT id FROM runners WHERE rule_id = (SELECT id FROM rules WHERE name = 'Verificar Memória' LIMIT 1) LIMIT 1) AND scheduled_for = '2025-11-27 11:45:00' LIMIT 1),
 2100, 'SUCCESS', 1, '1 registro encontrado com memória alta', NULL, '2025-11-27 11:45:10'),
((SELECT id FROM runners WHERE rule_id = (SELECT id FROM rules WHERE name = 'Verificar Disco Cheio' LIMIT 1) LIMIT 1),
 (SELECT id FROM runner_queue WHERE runner_id = (SELECT id FROM runners WHERE rule_id = (SELECT id FROM rules WHERE name = 'Verificar Disco Cheio' LIMIT 1) LIMIT 1) AND scheduled_for = '2025-11-27 09:15:00' LIMIT 1),
 890, 'SUCCESS', 0, 'Nenhum disco com espaço crítico', NULL, '2025-11-27 09:15:12'),
((SELECT id FROM runners WHERE rule_id = (SELECT id FROM rules WHERE name = 'Verificar Conexões BD' LIMIT 1) LIMIT 1),
 NULL,
 2450, 'SUCCESS', 45, '45 conexões ativas no banco', NULL, '2025-11-27 08:00:00'),
((SELECT id FROM runners WHERE rule_id = (SELECT id FROM rules WHERE name = 'Verificar Logs de Erro' LIMIT 1) LIMIT 1),
 (SELECT id FROM runner_queue WHERE runner_id = (SELECT id FROM runners WHERE rule_id = (SELECT id FROM rules WHERE name = 'Verificar Logs de Erro' LIMIT 1) LIMIT 1) AND scheduled_for = '2025-11-27 07:20:00' LIMIT 1),
 5100, 'TIMEOUT', NULL, NULL, 'Query execution timeout after 5000ms', '2025-11-27 07:20:08');

-- ======================================
-- Tabela incidents (6 registros - Adicionado registro faltante)
-- ======================================
INSERT INTO incidents (assigned_user_id, rule_id, status, priority, ack_at, closed_at) VALUES
((SELECT id FROM users WHERE email = 'admin@admin.com' LIMIT 1), (SELECT id FROM rules WHERE name = 'Verificar CPU Alta' LIMIT 1), 'CLOSED', 'HIGH', '2025-11-27 10:35:00', '2025-11-27 11:20:00'),
((SELECT id FROM users WHERE email = 'penkas@example.com' LIMIT 1), (SELECT id FROM rules WHERE name = 'Verificar Memória' LIMIT 1), 'ACK', 'CRITICAL', '2025-11-27 11:50:00', NULL),
((SELECT id FROM users WHERE email = 'penkas@example.com' LIMIT 1), (SELECT id FROM rules WHERE name = 'Verificar Disco Cheio' LIMIT 1), 'OPEN', 'MEDIUM', NULL, NULL),
((SELECT id FROM users WHERE email = 'rogerio@example.com' LIMIT 1), (SELECT id FROM rules WHERE name = 'Verificar CPU Alta' LIMIT 1), 'CLOSED', 'HIGH', '2025-11-26 14:10:00', '2025-11-26 15:30:00'),
((SELECT id FROM users WHERE email = 'penkas@example.com' LIMIT 1), (SELECT id FROM rules WHERE name = 'Verificar Memória' LIMIT 1), 'ACK', 'CRITICAL', '2025-11-27 08:15:00', NULL),
-- REGISTRO ADICIONADO PARA CORRIGIR ERRO DE FK NOS EVENTOS DE LOG:
((SELECT id FROM users WHERE email = 'maria.santos@qqtech.com' LIMIT 1), (SELECT id FROM rules WHERE name = 'Verificar Logs de Erro' LIMIT 1), 'CLOSED', 'HIGH', '2025-11-27 07:30:00', '2025-11-27 08:00:00');

-- ======================================
-- Tabela incidents_events (5 registros)
-- ======================================
INSERT INTO incidents_events (incident_id, previous_status, current_status, comment, action_user_id) VALUES
-- Adicionado LIMIT 1 DESC para pegar o incidente correto em caso de múltiplos
((SELECT id FROM incidents WHERE rule_id = (SELECT id FROM rules WHERE name = 'Verificar CPU Alta' LIMIT 1) ORDER BY id DESC LIMIT 1), 'OPEN', 'ACK', 'Incidente reconhecido pelo operador', (SELECT id FROM users WHERE email = 'admin@admin.com' LIMIT 1)),
((SELECT id FROM incidents WHERE rule_id = (SELECT id FROM rules WHERE name = 'Verificar CPU Alta' LIMIT 1) ORDER BY id DESC LIMIT 1), 'ACK', 'CLOSED', 'Problema resolvido - CPU normalizada', (SELECT id FROM users WHERE email = 'admin@admin.com' LIMIT 1)),
((SELECT id FROM incidents WHERE rule_id = (SELECT id FROM rules WHERE name = 'Verificar Memória' LIMIT 1) ORDER BY id DESC LIMIT 1), 'OPEN', 'ACK', 'Verificando uso de memória', (SELECT id FROM users WHERE email = 'admin@admin.com' LIMIT 1)),
((SELECT id FROM incidents WHERE rule_id = (SELECT id FROM rules WHERE name = 'Verificar Logs de Erro' LIMIT 1) ORDER BY id DESC LIMIT 1), 'OPEN', 'ACK', 'Analisando causa raiz', (SELECT id FROM users WHERE email = 'admin@admin.com' LIMIT 1)),
((SELECT id FROM incidents WHERE rule_id = (SELECT id FROM rules WHERE name = 'Verificar Logs de Erro' LIMIT 1) ORDER BY id DESC LIMIT 1), 'ACK', 'CLOSED', 'Memória cache limpa - resolvido', (SELECT id FROM users WHERE email = 'admin@admin.com' LIMIT 1));

-- ======================================
-- Tabela schedules (5 registros)
-- ======================================
INSERT INTO schedules (user_id, start_time, end_time) VALUES
((SELECT id FROM users WHERE email = 'admin@admin.com' LIMIT 1), '2025-11-27 08:00:00', '2025-11-27 16:00:00'),
((SELECT id FROM users WHERE email = 'rogerio@example.com' LIMIT 1), '2025-11-27 16:00:00', '2025-11-28 00:00:00'),
((SELECT id FROM users WHERE email = 'penkas@example.com' LIMIT 1), '2025-11-28 00:00:00', '2025-11-28 08:00:00'),
((SELECT id FROM users WHERE email = 'rogerio@example.com' LIMIT 1), '2025-11-28 08:00:00', '2025-11-28 16:00:00'),
((SELECT id FROM users WHERE email = 'admin@admin.com' LIMIT 1), '2025-11-28 16:00:00', '2025-11-29 00:00:00');

-- ======================================
-- Tabela notifications (5 registros)
-- ======================================
INSERT INTO notifications (incident_id, channel_id, user_id, title, message, sent_at, status, read_at) VALUES
((SELECT id FROM incidents WHERE rule_id = (SELECT id FROM rules WHERE name = 'Verificar CPU Alta' LIMIT 1) AND closed_at = '2025-11-27 11:20:00' LIMIT 1), (SELECT id FROM channels WHERE type='EMAIL' LIMIT 1), (SELECT id FROM users WHERE email = 'admin@admin.com' LIMIT 1), 'CPU Alta Detectada', 'O uso de CPU ultrapassou 80% nos últimos 5 minutos', '2025-11-27 10:30:20', 'READED', '2025-11-27 10:32:00'),
((SELECT id FROM incidents WHERE rule_id = (SELECT id FROM rules WHERE name = 'Verificar Memória' LIMIT 1) AND status='ACK' AND ack_at = '2025-11-27 11:50:00' LIMIT 1), (SELECT id FROM channels WHERE type='COMUNIQ' LIMIT 1), (SELECT id FROM users WHERE email = 'penkas@example.com' LIMIT 1), 'CRÍTICO: Memória Alta', 'Uso de memória crítico detectado - 92%', '2025-11-27 11:45:15', 'READED', '2025-11-27 11:46:00'),
((SELECT id FROM incidents WHERE rule_id = (SELECT id FROM rules WHERE name = 'Verificar Disco Cheio' LIMIT 1) AND status='OPEN' LIMIT 1), (SELECT id FROM channels WHERE type='PUSH' LIMIT 1), (SELECT id FROM users WHERE email = 'penkas@example.com' LIMIT 1), 'Disco com Pouco Espaço', 'Servidor XYZ com menos de 10% de espaço livre', '2025-11-27 12:00:00', 'SENT', NULL),
((SELECT id FROM incidents WHERE rule_id = (SELECT id FROM rules WHERE name = 'Verificar CPU Alta' LIMIT 1) AND closed_at = '2025-11-26 15:30:00' LIMIT 1), (SELECT id FROM channels WHERE type='PUSH SOUND' LIMIT 1), (SELECT id FROM users WHERE email = 'rogerio@example.com' LIMIT 1), 'Incidente Resolvido', 'CPU normalizada - incidente fechado', '2025-11-26 15:35:00', 'READED', '2025-11-26 15:40:00'),
((SELECT id FROM incidents WHERE rule_id = (SELECT id FROM rules WHERE name = 'Verificar Memória' LIMIT 1) AND status='ACK' AND ack_at = '2025-11-27 08:15:00' LIMIT 1), (SELECT id FROM channels WHERE type='EMAIL' LIMIT 1), (SELECT id FROM users WHERE email = 'penkas@example.com' LIMIT 1), 'Memória Crítica', 'Memória do servidor principal em nível crítico', '2025-11-27 08:16:00', 'SENT', NULL);

-- ======================================
-- Tabela audit_logs (5 registros)
-- ======================================
INSERT INTO audit_logs (entity_id, entity_type, action_type, old_value, new_value, user_id) VALUES
((SELECT id FROM rules WHERE name = 'Verificar CPU Alta' LIMIT 1), 'rules', 'UPDATE', '{"is_active": true}', '{"is_active": false}', (SELECT id FROM users WHERE email = 'admin@admin.com' LIMIT 1)),
((SELECT id FROM users WHERE email = 'maria@example.com' LIMIT 1), 'users', 'UPDATE', '{"pending": true}', '{"pending": false}', (SELECT id FROM users WHERE email = 'admin@admin.com' LIMIT 1)),
((SELECT id FROM incidents WHERE rule_id = (SELECT id FROM rules WHERE name = 'Verificar CPU Alta' LIMIT 1) AND closed_at = '2025-11-27 11:20:00' LIMIT 1), 'incidents', 'UPDATE', '{"status": "ACK"}', '{"status": "CLOSED"}', (SELECT id FROM users WHERE email = 'admin@admin.com' LIMIT 1)),
((SELECT id FROM rules WHERE name = 'Verificar Disco Cheio' LIMIT 1), 'rules', 'CREATE', NULL, '{"name": "Verificar Disco Cheio", "is_active": true}', (SELECT id FROM users WHERE email = 'penkas@example.com' LIMIT 1)),
((SELECT id FROM channels WHERE type='PUSH' LIMIT 1), 'channels', 'UPDATE', '{"is_active": true}', '{"is_active": false}', (SELECT id FROM users WHERE email = 'rogerio@example.com' LIMIT 1));

-- ======================================
-- Tabela sql_test_logs (5 registros)
-- ======================================
INSERT INTO sql_test_logs (user_id, sql, result) VALUES
((SELECT id FROM users WHERE email = 'admin@admin.com' LIMIT 1), 'SELECT COUNT(*) FROM users', '5 rows returned'),
((SELECT id FROM users WHERE email = 'penkas@example.com' LIMIT 1), 'SELECT * FROM rules WHERE is_active = true', '4 rows returned'),
((SELECT id FROM users WHERE email = 'rogerio@example.com' LIMIT 1), 'SELECT * FROM incidents WHERE status = ''OPEN''', '1 row returned'),
((SELECT id FROM users WHERE email = 'maria.santos@qqtech.com' LIMIT 1), 'SELECT COUNT(*) FROM notifications WHERE status = ''SENT''', '2 rows returned'),
((SELECT id FROM users WHERE email = 'admin@admin.com' LIMIT 1), 'SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 10', '5 rows returned');

-- ======================================
-- Tabela escalation_policy (5 registros)
-- ======================================
INSERT INTO escalation_policy (timeout_ms, role_id, is_active) VALUES
(300000, (SELECT id FROM roles WHERE name = 'Analista' LIMIT 1), true),
(600000, (SELECT id FROM roles WHERE name = 'Supervisor' LIMIT 1), true),
(900000, (SELECT id FROM roles WHERE name = 'Operador' LIMIT 1), true),
(1200000, (SELECT id FROM roles WHERE name = 'Administrador' LIMIT 1), true),
(180000, (SELECT id FROM roles WHERE name = 'Gerente' LIMIT 1), false);

-- ======================================
-- Tabela app_settings (5 registros)
-- ======================================
INSERT INTO app_settings (key, value, updated_by_user_id) VALUES
('notification_retry_count', '{"value": 3}', (SELECT id FROM users WHERE email = 'admin@admin.com' LIMIT 1)),
('max_incidents_per_user', '{"value": 10}', (SELECT id FROM users WHERE email = 'admin@admin.com' LIMIT 1)),
('incident_auto_close_hours', '{"value": 24}', (SELECT id FROM users WHERE email = 'admin@admin.com' LIMIT 1)),
('enable_email_notifications', '{"value": true}', (SELECT id FROM users WHERE email = 'admin@admin.com' LIMIT 1)),
('default_incident_priority', '{"value": "MEDIUM"}', (SELECT id FROM users WHERE email = 'admin@admin.com' LIMIT 1));