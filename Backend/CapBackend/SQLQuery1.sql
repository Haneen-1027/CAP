-- Table: roles 
CREATE TABLE roles (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(255) UNIQUE,
    created_at DATETIME,
    updated_at DATETIME
);

-- Table: users 
CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    password_hash VARCHAR(255),
    role_id INT,
    created_at DATETIME,
    updated_at DATETIME,
    email_verified BIT DEFAULT 0,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Table: addresses
CREATE TABLE addresses (
    id INT IDENTITY(1,1) PRIMARY KEY,
    street VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    postal_code VARCHAR(20),
    country VARCHAR(255),
    created_at DATETIME,
    updated_at DATETIME
);

-- Table: subscription_plans
CREATE TABLE subscription_plans (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(255),
    price DECIMAL(10, 2),
    features TEXT,
    duration INT,
    created_at DATETIME,
    updated_at DATETIME
);

-- Table: organizations (depends on addresses and subscription_plans)
CREATE TABLE organizations (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(255),
    address_id INT,
    contact_email VARCHAR(255),
    subscription_plan_id INT,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (address_id) REFERENCES addresses(id),
    FOREIGN KEY (subscription_plan_id) REFERENCES subscription_plans(id)
);

-- Table: assessments (depends on organizations and users)
CREATE TABLE assessments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(255),
    created_by INT,
    organization_id INT,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- Table: questions (depends on assessments)
CREATE TABLE questions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    assessment_id INT,
    type VARCHAR(50),
    max_score INT,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (assessment_id) REFERENCES assessments(id)
);

-- Table: mcq_questions (depends on questions)
CREATE TABLE mcq_questions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    question_id INT UNIQUE,
    prompt TEXT,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (question_id) REFERENCES questions(id)
);

-- Table: essay_questions (depends on questions)
CREATE TABLE essay_questions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    question_id INT UNIQUE,
    prompt TEXT,
    word_limit INT,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (question_id) REFERENCES questions(id)
);

-- Table: coding_questions (depends on questions)
CREATE TABLE coding_questions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    question_id INT UNIQUE,
    prompt TEXT,
    language VARCHAR(50),
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (question_id) REFERENCES questions(id)
);

-- Table: options (depends on mcq_questions)
CREATE TABLE options (
    id INT IDENTITY(1,1) PRIMARY KEY,
    mcq_question_id INT,
    text VARCHAR(255),
    is_correct BIT,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (mcq_question_id) REFERENCES mcq_questions(id)
);

-- Table: candidates (depends on users)
CREATE TABLE candidates (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT,
    profile_details TEXT,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table: organization_candidates (depends on organizations and candidates)
CREATE TABLE organization_candidates (
    id INT IDENTITY(1,1) PRIMARY KEY,
    organization_id INT,
    candidate_id INT,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (organization_id) REFERENCES organizations(id),
    FOREIGN KEY (candidate_id) REFERENCES candidates(id)
);

-- Table: assessment_statuses
CREATE TABLE assessment_statuses (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(255) UNIQUE,
    created_at DATETIME,
    updated_at DATETIME
);

-- Table: assessment_assignments (depends on assessments, candidates, and assessment_statuses)
CREATE TABLE assessment_assignments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    test_id INT,
    candidate_id INT,
    assigned_by INT,
    status_id INT,
    created_at DATETIME,
    updated_at DATETIME,
    completed_at DATETIME,
    FOREIGN KEY (test_id) REFERENCES assessments(id),
    FOREIGN KEY (candidate_id) REFERENCES candidates(id),
    FOREIGN KEY (status_id) REFERENCES assessment_statuses(id)
);

-- Table: responses (depends on assessment_assignments and questions)
CREATE TABLE responses (
    id INT IDENTITY(1,1) PRIMARY KEY,
    assignment_id INT,
    question_id INT,
    answer TEXT,
    score INT,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (assignment_id) REFERENCES assessment_assignments(id),
    FOREIGN KEY (question_id) REFERENCES questions(id)
);

-- Table: recruiters (depends on users and organizations)
CREATE TABLE recruiters (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT,
    organization_id INT,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- Continue with other dependent tables...
