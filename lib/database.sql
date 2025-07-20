-- yourehired.ai Database Schema
-- This file contains all table definitions, policies, and security configurations

-- =============================================================================
-- EXTENSIONS
-- =============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- CUSTOM TYPES
-- =============================================================================
CREATE TYPE subscription_tier AS ENUM ('free', 'basic', 'premium');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'incomplete');
CREATE TYPE ai_model AS ENUM ('gpt-3.5-turbo', 'gpt-4');
CREATE TYPE provider_type AS ENUM ('google', 'linkedin', 'email');

-- =============================================================================
-- MAIN TABLES
-- =============================================================================

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    provider provider_type NOT NULL DEFAULT 'email',
    provider_id TEXT,
    subscription_tier subscription_tier NOT NULL DEFAULT 'free',
    stripe_customer_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- User profiles table
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    phone TEXT,
    address TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    professional_summary TEXT,
    work_experience JSONB DEFAULT '[]'::jsonb,
    education JSONB DEFAULT '[]'::jsonb,
    skills JSONB DEFAULT '[]'::jsonb,
    certifications JSONB DEFAULT '[]'::jsonb,
    projects JSONB DEFAULT '[]'::jsonb,
    uploaded_resume_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id)
);

-- Subscriptions table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stripe_subscription_id TEXT,
    status subscription_status NOT NULL DEFAULT 'active',
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id)
);

-- Resumes table
CREATE TABLE resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    job_description TEXT NOT NULL,
    company_name TEXT,
    position_title TEXT,
    generated_content TEXT NOT NULL,
    model_used ai_model NOT NULL,
    tokens_used INTEGER NOT NULL DEFAULT 0,
    pdf_url TEXT,
    is_favorited BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Usage tracking table
CREATE TABLE usage_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    month_year TEXT NOT NULL, -- Format: 'YYYY-MM'
    resumes_generated INTEGER DEFAULT 0,
    total_tokens_used INTEGER DEFAULT 0,
    gpt4_tokens_used INTEGER DEFAULT 0,
    gpt35_tokens_used INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, month_year)
);

-- Admin audit log table
CREATE TABLE admin_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_user_id UUID REFERENCES users(id),
    target_user_id UUID REFERENCES users(id),
    action TEXT NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_stripe_customer ON users(stripe_customer_id);
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_resumes_created_at ON resumes(created_at DESC);
CREATE INDEX idx_usage_tracking_user_month ON usage_tracking(user_id, month_year);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);

-- =============================================================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- User profiles policies
CREATE POLICY "Users can access own profile" ON user_profiles
    FOR ALL USING (auth.uid() = user_id);

-- Resumes policies
CREATE POLICY "Users can access own resumes" ON resumes
    FOR ALL USING (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscription" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" ON subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- Usage tracking policies
CREATE POLICY "Users can view own usage" ON usage_tracking
    FOR SELECT USING (auth.uid() = user_id);

-- Admin audit log policies (admin only)
CREATE POLICY "Only admins can access audit log" ON admin_audit_log
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND email = 'admin@yourehired.ai'
        )
    );

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to get or create usage tracking for current month
CREATE OR REPLACE FUNCTION get_or_create_monthly_usage(p_user_id UUID)
RETURNS usage_tracking AS $$
DECLARE
    current_month TEXT := TO_CHAR(NOW(), 'YYYY-MM');
    usage_record usage_tracking;
BEGIN
    SELECT * INTO usage_record 
    FROM usage_tracking 
    WHERE user_id = p_user_id AND month_year = current_month;
    
    IF NOT FOUND THEN
        INSERT INTO usage_tracking (user_id, month_year)
        VALUES (p_user_id, current_month)
        RETURNING * INTO usage_record;
    END IF;
    
    RETURN usage_record;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can generate resume
CREATE OR REPLACE FUNCTION can_generate_resume(p_user_id UUID, p_model ai_model)
RETURNS BOOLEAN AS $$
DECLARE
    user_tier subscription_tier;
    current_usage usage_tracking;
    monthly_limit INTEGER;
BEGIN
    -- Get user's subscription tier
    SELECT subscription_tier INTO user_tier 
    FROM users WHERE id = p_user_id;
    
    -- Get current month usage
    current_usage := get_or_create_monthly_usage(p_user_id);
    
    -- Set limits based on tier and model
    IF user_tier = 'free' THEN
        -- Free tier: 10 lifetime resumes, GPT-3.5 only
        IF p_model = 'gpt-4' THEN
            RETURN FALSE;
        END IF;
        SELECT COUNT(*) <= 10 INTO monthly_limit 
        FROM resumes WHERE user_id = p_user_id;
        RETURN monthly_limit;
    ELSIF user_tier = 'basic' THEN
        -- Basic tier: 500 GPT-3.5 OR 40 GPT-4 per month
        IF p_model = 'gpt-4' THEN
            RETURN current_usage.gpt4_tokens_used < 40;
        ELSE
            RETURN current_usage.gpt35_tokens_used < 500;
        END IF;
    ELSIF user_tier = 'premium' THEN
        -- Premium tier: 1500 GPT-3.5 OR 120 GPT-4 per month
        IF p_model = 'gpt-4' THEN
            RETURN current_usage.gpt4_tokens_used < 120;
        ELSE
            RETURN current_usage.gpt35_tokens_used < 1500;
        END IF;
    END IF;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment usage after resume generation
CREATE OR REPLACE FUNCTION increment_usage(
    p_user_id UUID, 
    p_model ai_model, 
    p_tokens_used INTEGER
)
RETURNS VOID AS $$
DECLARE
    current_month TEXT := TO_CHAR(NOW(), 'YYYY-MM');
BEGIN
    INSERT INTO usage_tracking (user_id, month_year, resumes_generated, total_tokens_used, gpt4_tokens_used, gpt35_tokens_used)
    VALUES (
        p_user_id, 
        current_month, 
        1, 
        p_tokens_used,
        CASE WHEN p_model = 'gpt-4' THEN 1 ELSE 0 END,
        CASE WHEN p_model = 'gpt-3.5-turbo' THEN 1 ELSE 0 END
    )
    ON CONFLICT (user_id, month_year) 
    DO UPDATE SET
        resumes_generated = usage_tracking.resumes_generated + 1,
        total_tokens_used = usage_tracking.total_tokens_used + p_tokens_used,
        gpt4_tokens_used = usage_tracking.gpt4_tokens_used + 
            CASE WHEN p_model = 'gpt-4' THEN 1 ELSE 0 END,
        gpt35_tokens_used = usage_tracking.gpt35_tokens_used + 
            CASE WHEN p_model = 'gpt-3.5-turbo' THEN 1 ELSE 0 END,
        updated_at = TIMEZONE('utc', NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Updated at triggers
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at 
    BEFORE UPDATE ON subscriptions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_tracking_updated_at 
    BEFORE UPDATE ON usage_tracking 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- INITIAL DATA
-- =============================================================================

-- Insert admin user (will be updated with actual admin email)
INSERT INTO users (email, name, provider, subscription_tier) 
VALUES ('admin@yourehired.ai', 'Admin User', 'email', 'premium')
ON CONFLICT (email) DO NOTHING;

-- =============================================================================
-- GRANTS AND PERMISSIONS
-- =============================================================================

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_or_create_monthly_usage(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION can_generate_resume(UUID, ai_model) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_usage(UUID, ai_model, INTEGER) TO authenticated; 