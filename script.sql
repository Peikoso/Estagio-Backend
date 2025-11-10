-- Habilita função gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ======================================
-- Tabela roles
-- ======================================
CREATE TABLE IF NOT EXISTS roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(20) NOT NULL,
    color varchar(20) NOT NULL,
    description varchar(150) NOT NULL,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
);

-- ======================================
-- Tabela users
-- ======================================
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_id varchar(128) UNIQUE,
    name varchar(100) NOT NULL,
    matricula varchar(30) NOT NULL UNIQUE,
    email varchar(120) NOT NULL UNIQUE,
    phone varchar(20),
    picture varchar(255),
    profile varchar(30) NOT NULL, -- ex: admin, operator, viewer
    pending boolean NOT NULL DEFAULT true,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now(),
    push_enabled boolean NOT NULL DEFAULT false,
    email_enabled boolean NOT NULL DEFAULT false,
    comuniq_enabled boolean NOT NULL DEFAULT false,
    push_sound_enabled boolean NOT NULL DEFAULT false
);

-- ======================================
-- Tabela rules
-- ======================================
CREATE TABLE IF NOT EXISTS rules (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(100) NOT NULL,
    description varchar(255) NOT NULL,
    sql text NOT NULL,
    priority varchar(10) NOT NULL,
    execution_interval_ms integer NOT NULL,
    max_error_count integer NOT NULL,
    timeout_ms integer NOT NULL,
    start_time time NOT NULL,
    end_time time NOT NULL,
    notification_enabled boolean NOT NULL DEFAULT true,
    is_active boolean NOT NULL DEFAULT true,
    silence_mode boolean NOT NULL DEFAULT false,
    postpone_date timestamp DEFAULT NULL,
    user_creator_id uuid,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now(),
    CONSTRAINT fk_rules_user_creator FOREIGN KEY (user_creator_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_rules_priority CHECK (priority IN ('LOW','MEDIUM','HIGH'))
);

-- ======================================
-- Tabela rules_roles (associação rule <-> role)
-- ======================================
CREATE TABLE IF NOT EXISTS rules_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_id uuid NOT NULL,
    role_id uuid NOT NULL,
    created_at timestamp NOT NULL DEFAULT now(),
    CONSTRAINT fk_rules_roles_rule FOREIGN KEY (rule_id) REFERENCES rules(id) ON DELETE CASCADE,
    CONSTRAINT fk_rules_roles_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    CONSTRAINT uq_rules_roles UNIQUE (rule_id, role_id)
);

-- ======================================
-- Tabela users_roles (associação user <-> role)
-- ======================================
CREATE TABLE IF NOT EXISTS users_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    role_id uuid NOT NULL,
    created_at timestamp NOT NULL DEFAULT now(),
    CONSTRAINT fk_users_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_users_roles_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    CONSTRAINT uq_users_roles UNIQUE (user_id, role_id)
);

-- ======================================
-- Tabela incidents
-- ======================================
CREATE TABLE IF NOT EXISTS incidents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    assigned_user_id uuid,
    rule_id uuid NOT NULL,
    status varchar(10) NOT NULL,
    priority varchar(10) NOT NULL,
    ack_at timestamp,
    closed_at timestamp,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now(),
    CONSTRAINT fk_incidents_rule FOREIGN KEY (rule_id) REFERENCES rules(id) ON DELETE CASCADE,
    CONSTRAINT fk_incidents_assigned_user FOREIGN KEY (assigned_user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_incidents_status CHECK (status IN ('OPEN','ACK','CLOSED')),
    CONSTRAINT chk_incidents_priority CHECK (priority IN ('LOW','MEDIUM','HIGH'))
);

-- ======================================
-- Tabela schedule (escala/on-call)
-- ======================================
CREATE TABLE IF NOT EXISTS schedule (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    channel varchar(30) NOT NULL,
    start_time timestamp NOT NULL,
    end_time timestamp NOT NULL,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now(),
    CONSTRAINT fk_schedule_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ======================================
-- Tabela incidents_logs (histórico)
-- ======================================
CREATE TABLE IF NOT EXISTS incidents_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id uuid NOT NULL,
    previous_status varchar(10) NOT NULL,
    current_status varchar(10) NOT NULL,
    comment varchar(255) NOT NULL,
    action_user_id uuid,
    created_at timestamp NOT NULL DEFAULT now(),
    CONSTRAINT fk_incident_logs_incident FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE,
    CONSTRAINT fk_incident_logs_user FOREIGN KEY (action_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ======================================
-- Tabela incidents_roles
-- ======================================
CREATE TABLE IF NOT EXISTS incidents_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id uuid NOT NULL,
    role_id uuid NOT NULL,
    created_at timestamp NOT NULL DEFAULT now(),
    CONSTRAINT fk_incidents_roles_incident FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE,
    CONSTRAINT fk_incidents_roles_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    CONSTRAINT uq_incident_role UNIQUE (incident_id, role_id)
);

-- ======================================
-- Tabela runners
-- ======================================
CREATE TABLE IF NOT EXISTS runners (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_id uuid NOT NULL,
    status varchar(15) NOT NULL,
    last_run_at timestamp,
    next_run_at timestamp,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now(),
    CONSTRAINT fk_runners_rule FOREIGN KEY (rule_id) REFERENCES rules(id) ON DELETE CASCADE
);

-- ======================================
-- Tabela runner_logs
-- ======================================
CREATE TABLE IF NOT EXISTS runner_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    runner_id uuid NOT NULL,
    run_time_ms integer NOT NULL,
    result text,
    error text,
    executed_at timestamp NOT NULL DEFAULT now(),
    CONSTRAINT fk_runner_logs_runner FOREIGN KEY (runner_id) REFERENCES runners(id) ON DELETE CASCADE
);

-- ======================================
-- Tabela rule_logs
-- ======================================
CREATE TABLE IF NOT EXISTS rule_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_id uuid NOT NULL,
    user_id uuid,
    action_type varchar(50) NOT NULL,
    description varchar(255),
    old_value jsonb,
    new_value jsonb,
    created_at timestamp NOT NULL DEFAULT now(),
    CONSTRAINT fk_rule_logs_rule FOREIGN KEY (rule_id) REFERENCES rules(id) ON DELETE CASCADE,
    CONSTRAINT fk_rule_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ======================================
-- Tabela notifications_logs
-- ======================================
CREATE TABLE IF NOT EXISTS notifications_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id uuid NOT NULL,
    user_id uuid,
    title varchar(150) NOT NULL,
    message text NOT NULL,
    channel varchar(30) NOT NULL,
    created_at timestamp NOT NULL DEFAULT now(),
    duration_ms integer NOT NULL,
    CONSTRAINT fk_notifications_incident FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE,
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ======================================
-- Tabela schedule_logs
-- ======================================
CREATE TABLE IF NOT EXISTS schedule_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_id uuid NOT NULL,
    user_id uuid,
    action_type varchar(50) NOT NULL,
    description varchar(255),
    old_value jsonb,
    new_value jsonb,
    created_at timestamp NOT NULL DEFAULT now(),
    CONSTRAINT fk_schedule_logs_schedule FOREIGN KEY (schedule_id) REFERENCES schedule(id) ON DELETE CASCADE,
    CONSTRAINT fk_schedule_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ======================================
-- Tabela sql_test_logs
-- ======================================
CREATE TABLE IF NOT EXISTS sql_test_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_id uuid NOT NULL,
    user_id uuid,
    sql text NOT NULL,
    result text,
    created_at timestamp NOT NULL DEFAULT now(),
    CONSTRAINT fk_sql_test_logs_rule FOREIGN KEY (rule_id) REFERENCES rules(id) ON DELETE CASCADE,
    CONSTRAINT fk_sql_test_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ======================================
-- Tabela escalation_policy
-- ======================================
CREATE TABLE IF NOT EXISTS escalation_policy (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    timeout_ms integer NOT NULL,
    role_id uuid NOT NULL,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now(),
    CONSTRAINT fk_escalation_policy_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- ======================================
-- Tabela app_settings
-- ======================================
CREATE TABLE IF NOT EXISTS app_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    data jsonb NOT NULL,
    updated_at timestamp NOT NULL DEFAULT now()
);

-- ======================================
-- Índices adicionais
-- ======================================
CREATE INDEX IF NOT EXISTS idx_rules_user_creator_id ON rules (user_creator_id);
CREATE INDEX IF NOT EXISTS idx_incidents_rule_id ON incidents (rule_id);
CREATE INDEX IF NOT EXISTS idx_incidents_assigned_user_id ON incidents (assigned_user_id);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents (status);
CREATE INDEX IF NOT EXISTS idx_runners_rule_id ON runners (rule_id);
CREATE INDEX IF NOT EXISTS idx_notifications_incident_id ON notifications_logs (incident_id);
CREATE INDEX IF NOT EXISTS idx_schedule_user_id ON schedule (user_id);
