# yourehired.ai - AI-Powered Resume Builder

> **Status:** In Development (MVP Target: 1 Week)  
> **Domain:** yourehired.ai  
> **Target Launch:** [DATE]

## 🎯 Project Overview

yourehired.ai is a comprehensive AI-powered SaaS platform that helps users create optimized resumes and cover letters tailored to specific job descriptions. The platform features intelligent job matching, multiple subscription tiers, and a seamless user experience designed to maximize job application success.

### ✨ Core Value Proposition
- **AI-Powered Customization**: Generate resumes tailored to specific job descriptions using OpenAI GPT models
- **One-Page Optimization**: Focus on concise, ATS-friendly, single-page resumes
- **Intelligent Job Matching**: Connect users with relevant opportunities (paid plans)
- **Multiple Export Formats**: PDF and Word document generation
- **Typeform-Style Onboarding**: Smooth, guided user experience

## 🏗️ Technical Architecture

### **Tech Stack**
```
Frontend & Backend: Next.js 14 (TypeScript, App Router)
Database: Supabase (PostgreSQL)
Authentication: NextAuth.js + Supabase
Payments: Stripe
AI: OpenAI API (GPT-3.5-turbo, GPT-4)
Email: Resend
UI Components: shadcn/ui + Tailwind CSS
Document Generation: react-pdf, jspdf, docx
Analytics: Google Analytics
Deployment: Vercel
```

### **Infrastructure Security**
- Row Level Security (RLS) on all database tables
- AES-256 encryption for sensitive data
- TLS 1.3 for all communications
- Rate limiting on all API endpoints
- Comprehensive audit logging
- GDPR/CCPA compliant data handling

## 📊 Database Schema

### **Core Tables**
```sql
users
├── id (uuid, PK)
├── email (text, unique)
├── name (text)
├── provider (google|linkedin)
├── subscription_tier (free|basic|premium)
├── stripe_customer_id (text, nullable)
└── timestamps

user_profiles
├── id (uuid, PK)
├── user_id (uuid, FK)
├── personal_info (phone, address)
├── professional_summary (text)
├── work_experience (jsonb)
├── education (jsonb)
├── skills (jsonb)
├── certifications (jsonb)
├── portfolio_urls (jsonb)
├── uploaded_resume_url (text)
└── timestamps

resumes
├── id (uuid, PK)
├── user_id (uuid, FK)
├── title (text)
├── job_description (text)
├── generated_content (text)
├── model_used (gpt-3.5-turbo|gpt-4)
├── tokens_used (integer)
├── pdf_url (text)
├── is_favorited (boolean)
└── timestamps

subscriptions
├── id (uuid, PK)
├── user_id (uuid, FK)
├── stripe_subscription_id (text)
├── status (active|canceled|past_due)
├── current_period_start/end (timestamp)
└── timestamps

usage_tracking
├── id (uuid, PK)
├── user_id (uuid, FK)
├── month_year (text) -- 'YYYY-MM'
├── resumes_generated (integer)
├── total_tokens_used (integer)
├── gpt4_tokens_used (integer)
└── timestamps
```

## 💰 Subscription Plans & Pricing

### **Plan Structure**
| Feature | Free | Basic ($9.99/mo) | Premium ($29.99/mo) |
|---------|------|------------------|---------------------|
| Resume Generations | 10 lifetime | 500 GPT-3.5 OR 40 GPT-4/mo | 1500 GPT-3.5 OR 120 GPT-4/mo |
| Saved Resumes | 3 | 10 | 100 |
| Cover Letters | ❌ | ✅ | ✅ |
| Job Matching | ❌ | ❌ | ✅ |
| LinkedIn Import | ❌ | ✅ | ✅ |
| Priority Support | ❌ | ✅ | ✅ |
| Advanced AI | ❌ | ✅ | ✅ |

### **Token Economics (70% Profit Margin)**
```javascript
// Cost per generation
GPT-3.5-turbo: ~$0.002-0.004 (1-2K tokens)
GPT-4: ~$0.08-0.15 (1-2K tokens)

// Monthly limits ensure profitability
Basic: ~500 GPT-3.5 OR ~40 GPT-4 generations
Premium: ~1500 GPT-3.5 OR ~120 GPT-4 generations
```

## 🎨 User Experience Design

### **Design System**
- **Color Scheme**: Black, white, and blue accents
- **Typography**: Clean, minimal, professional
- **UI Framework**: shadcn/ui components
- **Responsive**: Mobile-optimized, desktop-focused
- **Animations**: Framer Motion for smooth transitions

### **User Onboarding Flow (12 Steps)**
```
1. Welcome & Account Creation (Social login preferred)
2. Plan Selection (with upgrade prompts)
3. Personal Information (name, contact)
4. Professional Summary (AI-assisted)
5. Career Stage Selection (graduate/changer/experienced)
6. Work Experience (upload/manual/LinkedIn import)
7. Education Background
8. Skills Assessment (autocomplete + self-rating)
9. Certifications (optional)
10. Portfolio Links (LinkedIn, GitHub, website)
11. Career Goals & Preferences
12. Setup Complete + First Resume Generation
```

## 🤖 AI Integration Strategy

### **OpenAI Prompt Engineering**
```javascript
const RESUME_PROMPT = `
You are an expert resume writer and career coach.
Create a professional, ATS-optimized, single-page resume.

User Profile: {userProfile}
Job Description: {jobDescription}
Target Model: {gpt35|gpt4}

Requirements:
- Single page format (strict)
- Quantify achievements with metrics
- Use action verbs and power words
- Tailor skills to job requirements
- ATS keyword optimization
- Professional formatting
`;

const COVER_LETTER_PROMPT = `
Generate a compelling cover letter tailored to:
Job Description: {jobDescription}
User Profile: {userProfile}
Word Limit: {wordLimit}
Company: {companyName}
`;
```

### **AI Quality Metrics**
- ATS compatibility score
- Keyword match percentage
- Professional tone assessment
- Achievement quantification rate

## 🔐 Security Implementation

### **Authentication & Authorization**
```javascript
// Multi-layer security
- NextAuth.js with social providers
- Row Level Security (RLS) policies
- Session management with JWTs
- Rate limiting on sensitive endpoints
- CSRF protection
- Admin impersonation with audit logging
```

### **Data Protection**
```javascript
// Encryption strategy
- AES-256-GCM for sensitive fields
- TLS 1.3 for data in transit
- Secure file storage in Supabase
- Regular security audits
- GDPR/CCPA compliance
```

### **Rate Limiting**
```javascript
const RATE_LIMITS = {
  '/api/auth/*': '10/minute/IP',
  '/api/resume/generate': '5/minute/user',
  '/api/upload': '3/minute/user',
  '/api/user/profile': '20/minute/user',
  '/api/admin/*': '50/minute/admin'
};
```

## 📧 Communication Strategy

### **Email Infrastructure (Resend)**
```javascript
// Transactional emails
- Welcome sequence
- Password reset
- Subscription confirmations  
- Usage limit warnings
- Billing notifications
- Security alerts
```

### **Customer Support**
- **Primary**: Voiceflow chatbot integration
- **Secondary**: Email support (help@yourehired.ai)
- **Response Times**: 
  - Free: 48 hours
  - Basic: 24 hours  
  - Premium: 4 hours

## 🚀 Development Roadmap

### **Week 1 - MVP Launch**
```
Day 1-2: Project Setup & Core Infrastructure
├── Next.js project initialization
├── Supabase database setup
├── Authentication flow
├── Basic UI components
└── Landing page

Day 3-4: Resume Builder Core
├── Onboarding flow implementation
├── OpenAI API integration
├── PDF generation
├── User dashboard
└── Resume saving/management

Day 5-6: Subscription System
├── Stripe integration
├── Usage tracking
├── Plan limitations
├── Billing management
└── Email notifications

Day 7: Polish & Launch
├── Testing & bug fixes
├── Performance optimization
├── Analytics setup
├── Production deployment
└── Launch preparation
```

### **Post-MVP Features (Week 2+)**
```
Week 2: Enhanced Features
├── Job matching (LinkedIn/Indeed APIs)
├── Advanced resume templates
├── Word document export
├── URL parsing for job descriptions
└── Enhanced user analytics

Week 3-4: Growth Features
├── Referral program
├── SEO content creation
├── Advanced AI features
├── Team/enterprise plans
└── Mobile app considerations
```

## 📊 Analytics & Monitoring

### **Key Metrics (MVP)**
```javascript
// User acquisition
- Signup conversion rate
- Onboarding completion rate
- Time to first resume generation

// Engagement
- Monthly active users
- Resume generations per user
- Feature adoption rates

// Business
- Monthly recurring revenue (MRR)
- Customer acquisition cost (CAC)
- Lifetime value (LTV)
- Churn rate by plan

// Technical
- API response times
- Error rates
- Uptime monitoring
- Token usage patterns
```

### **Monitoring Stack**
- **Analytics**: Google Analytics 4
- **Error Tracking**: Built-in Next.js error handling
- **Performance**: Vercel Analytics
- **Uptime**: Basic monitoring (expand post-MVP)

## 🔧 Environment Configuration

### **Required Environment Variables**
```bash
# Database
DATABASE_URL="postgresql://..."
SUPABASE_URL="https://..."
SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."

# Authentication
NEXTAUTH_URL="https://yourehired.ai"
NEXTAUTH_SECRET="cryptographically-secure-secret"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
LINKEDIN_CLIENT_ID="..."
LINKEDIN_CLIENT_SECRET="..."

# AI
OPENAI_API_KEY="sk-..."

# Payments
STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_SECRET_KEY="sk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_BASIC_PRICE_ID="price_..."
STRIPE_PREMIUM_PRICE_ID="price_..."

# Email
RESEND_API_KEY="re_..."

# Admin
ADMIN_MASTER_PASSWORD="bcrypt-hashed-password"
ENCRYPTION_KEY="base64-encoded-32-byte-key"

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-..."
```

## 🧪 Testing Strategy

### **MVP Testing Approach**
```javascript
// Critical user journeys
- Complete onboarding flow
- Resume generation (both models)
- Subscription upgrade/downgrade
- Payment processing
- Data export functionality

// Automated testing
- API endpoint testing
- Authentication flow testing
- Database operations testing
- Basic UI component testing
```

## 📈 Business Model

### **Revenue Streams**
1. **Subscription Revenue**: Primary income from Basic/Premium plans
2. **Usage Overages**: Future potential for pay-per-use
3. **Enterprise Plans**: Future B2B opportunities
4. **Affiliate Partnerships**: Job board referrals

### **Growth Strategy**
1. **SEO Content**: Resume writing tips, career advice
2. **Social Proof**: User testimonials and success stories
3. **Referral Program**: Incentivize user acquisition
4. **Partnership**: Integration with job boards
5. **Content Marketing**: AI resume optimization guides

## 🤝 Support & Documentation

### **User Documentation**
- Getting started guide
- Feature tutorials
- Best practices for resume optimization
- Troubleshooting common issues

### **Developer Documentation**
- API documentation
- Database schema
- Deployment guide
- Security protocols

## 📞 Contact & Support

### **Business Contacts**
- **General**: hello@yourehired.ai
- **Support**: help@yourehired.ai
- **Legal**: legal@yourehired.ai
- **Privacy**: privacy@yourehired.ai

### **Technical Support**
- **Admin**: admin@yourehired.ai
- **Development**: dev@yourehired.ai

## 📝 Legal Compliance

### **Required Documents**
- ✅ Terms of Service (comprehensive)
- ✅ Privacy Policy (GDPR/CCPA compliant)
- 🔄 Cookie Policy (implementation pending)
- 🔄 Data Processing Agreement (for EU users)

### **Compliance Features**
- Data export functionality
- Account deletion with data purging
- Cookie consent management
- Audit logging for admin actions
- Encryption for sensitive data

---

## 🚀 Quick Start

```bash
# Clone and setup
git clone [repository]
cd yourehired-ai
npm install

# Environment setup
cp .env.example .env.local
# Fill in environment variables

# Database setup
npx supabase init
npx supabase start
npm run db:setup

# Development
npm run dev
```

## 📋 MVP Checklist

### **Core Features**
- [ ] User authentication (Google/LinkedIn)
- [ ] Onboarding flow (12 steps)
- [ ] Resume generation (GPT-3.5/GPT-4)
- [ ] PDF export functionality
- [ ] User dashboard
- [ ] Subscription management
- [ ] Usage tracking
- [ ] Basic error handling

### **Business Features**
- [ ] Stripe payment integration
- [ ] Plan upgrade/downgrade
- [ ] Usage limits enforcement
- [ ] Email notifications
- [ ] Basic analytics

### **Deployment**
- [ ] Production environment setup
- [ ] Domain configuration
- [ ] SSL certificate
- [ ] Database migration
- [ ] Error monitoring

---

*This README serves as the single source of truth for the yourehired.ai project. Update as features are implemented and requirements evolve.* 