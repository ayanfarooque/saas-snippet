import React from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen, Zap, Link2, Shield, Save, Tags, Search, Copy, Share2, Download, ArrowRight, Check, X as XIcon, Star } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import TagPill from '../components/ui/TagPill';

/* ============================================
   SECTION 1.2 — Hero
   ============================================ */
function HeroSection() {
  return (
    <section style={{
      position: 'relative',
      backgroundColor: 'var(--bg-primary)',
      overflow: 'hidden',
      paddingTop: '80px',
      paddingBottom: '60px',
    }}>
      {/* Orange glow orb */}
      <div style={{
        position: 'absolute',
        top: '-120px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '500px',
        background: 'radial-gradient(ellipse, rgba(249,115,22,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '99px',
          backgroundColor: 'var(--orange-glow)',
          border: '1px solid rgba(249,115,22,0.2)',
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--orange-400)',
          marginBottom: '28px',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--orange-500)' }} />
          Now with AI-powered search
        </div>

        {/* Headline */}
        <h1 className="heading-xl" style={{ fontSize: 'clamp(36px, 5vw, 52px)', marginBottom: '20px' }}>
          Your prompts.<br />
          <span style={{ color: 'var(--orange-500)' }}>Always ready.</span><br />
          <span style={{ color: 'var(--text-muted)' }}>Never lost.</span>
        </h1>

        {/* Subtext */}
        <p style={{
          fontSize: '17px',
          color: 'var(--text-secondary)',
          maxWidth: '480px',
          margin: '0 auto 32px',
          lineHeight: 1.6,
        }}>
          Save, tag, and search your AI prompts and code snippets.
          Share with your team. Access anywhere.
        </p>

        {/* CTA buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/signup" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="lg">Start for free →</Button>
          </Link>
          <a href="#features" style={{ textDecoration: 'none' }}>
            <Button variant="secondary" size="lg">View demo ↗</Button>
          </a>
        </div>

        {/* Hero Visual — Floating app mockup */}
        <div style={{
          marginTop: '56px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-secondary)',
          boxShadow: '0 0 0 1px rgba(249,115,22,0.15), 0 24px 48px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          maxWidth: '640px',
          margin: '56px auto 0',
        }}>
          {/* macOS chrome */}
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--border-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#FF5F57' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#FEBC2E' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#28C840' }} />
            </div>
            <span style={{ flex: 1, textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
              My Snippet Library — 847 saved
            </span>
          </div>

          {/* Snippet rows */}
          <div style={{ padding: '4px' }}>
            {[
              {
                title: 'ChatGPT — Detailed code reviewer',
                preview: 'You are an expert code reviewer. Analyze the code for bugs, performance issues, and suggest improvements...',
                tags: ['AI prompt', 'code review', 'GPT-4'],
              },
              {
                title: 'SQL — Paginated query template',
                preview: 'SELECT * FROM users WHERE active = true ORDER BY created_at DESC LIMIT :limit OFFSET :offset;',
                tags: ['SQL', 'pagination'],
              },
              {
                title: 'Meeting summary prompt',
                preview: 'Summarize the following meeting transcript into key decisions, action items, and follow-ups...',
                tags: ['AI prompt', 'meetings'],
              },
            ].map((s, i) => (
              <div key={i} style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                transition: 'var(--transition-fast)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                borderBottom: i < 2 ? '1px solid var(--border-primary)' : 'none',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>{s.title}</span>
                  <div style={{ display: 'flex', gap: '8px', opacity: 0.4 }}>
                    <Copy size={13} style={{ color: 'var(--text-muted)' }} />
                    <Share2 size={13} style={{ color: 'var(--text-muted)' }} />
                  </div>
                </div>
                <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {s.preview}
                </span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {s.tags.map(tag => <TagPill key={tag} name={tag} size="sm" />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   SECTION 1.3 — Feature Strip
   ============================================ */
function FeatureStrip() {
  const items = [
    { icon: '📁', label: 'Organize', desc: 'Tags, folders, collections' },
    { icon: '⚡', label: 'Instant search', desc: 'Full-text across all snippets' },
    { icon: '🔗', label: 'Share links', desc: 'Public permalink per snippet' },
    { icon: '🔒', label: 'Private by default', desc: 'You control visibility' },
  ];

  return (
    <section style={{
      backgroundColor: 'var(--bg-primary)',
      borderTop: '1px solid var(--border-primary)',
      borderBottom: '1px solid var(--border-primary)',
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      }}>
        {items.map((item, i) => (
          <div key={i} style={{
            padding: '32px 24px',
            textAlign: 'center',
            borderRight: i < items.length - 1 ? '1px solid var(--border-primary)' : 'none',
          }}>
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>{item.icon}</div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{item.label}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================
   SECTION 1.4 — Stats Strip
   ============================================ */
function StatsStrip() {
  const stats = [
    { number: '12,400+', label: 'Snippets saved' },
    { number: '2,800+', label: 'Active users' },
    { number: '4.9 ★', label: 'Average rating' },
    { number: '99.9%', label: 'Uptime' },
  ];

  return (
    <section style={{
      background: 'linear-gradient(180deg, var(--bg-primary) 0%, var(--orange-glow) 50%, var(--bg-tertiary) 100%)',
      padding: '48px 24px',
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '24px',
        textAlign: 'center',
      }}>
        {stats.map((s, i) => (
          <div key={i}>
            <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--orange-500)', letterSpacing: '-0.02em' }}>{s.number}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================
   SECTION 1.5 — Features Deep-Dive
   ============================================ */
function FeaturesSection() {
  const features = [
    { icon: Save, title: 'Save instantly', desc: 'Keyboard shortcut to save. Browser extension coming soon. Capture snippets in seconds.' },
    { icon: Tags, title: 'Tag & organize', desc: 'Unlimited tags on Pro, color-coded by category. Find anything in one click.' },
    { icon: Search, title: 'Full-text search', desc: 'Search across titles, content, and tags simultaneously. Lightning fast results.' },
    { icon: Copy, title: 'One-click copy', desc: 'Copy any snippet to clipboard instantly. Track copy usage on Pro plan.' },
    { icon: Share2, title: 'Shareable links', desc: 'Generate a unique public URL for any snippet. Share with anyone, no login needed.' },
    { icon: Download, title: 'Export anytime', desc: 'Download all snippets as JSON or CSV. Your data belongs to you, always.' },
  ];

  return (
    <section id="features" style={{
      backgroundColor: 'var(--bg-tertiary)',
      padding: '80px 24px',
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--orange-500)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '12px',
          }}>
            FEATURES
          </div>
          <h2 className="heading-lg" style={{ fontSize: '32px', color: 'var(--text-primary)' }}>
            Everything you need, nothing you don&apos;t
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}>
          {features.map((f, i) => (
            <div key={i} style={{
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-secondary)',
              boxShadow: 'var(--shadow-card)',
              transition: 'var(--transition-fast)',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--orange-glow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}>
                <f.icon size={18} style={{ color: 'var(--orange-500)' }} />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>{f.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   SECTION 1.6 — How It Works
   ============================================ */
function HowItWorks() {
  const steps = [
    { num: '1', title: 'Sign up', desc: 'Create your free account, no credit card needed.' },
    { num: '2', title: 'Save your first snippet', desc: 'Paste any prompt, code, or text. Add tags to organize.' },
    { num: '3', title: 'Access anywhere', desc: 'Search, copy, share. Never lose a prompt again.' },
  ];

  return (
    <section style={{
      backgroundColor: 'var(--bg-tertiary)',
      padding: '64px 24px 80px',
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h2 className="heading-lg" style={{ fontSize: '28px', marginBottom: '48px', color: 'var(--text-primary)' }}>
          Up and running in 60 seconds
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '32px',
          position: 'relative',
        }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--orange-glow)',
                border: '2px solid var(--orange-500)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 700,
                color: 'var(--orange-500)',
              }}>
                {step.num}
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{step.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   SECTION 1.7 — Pricing
   ============================================ */
function PricingSection() {
  return (
    <section id="pricing" style={{
      backgroundColor: 'var(--bg-tertiary)',
      padding: '80px 24px',
    }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          fontSize: '12px',
          fontWeight: 600,
          color: 'var(--orange-500)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '12px',
        }}>
          PRICING
        </div>
        <h2 className="heading-lg" style={{ fontSize: '32px', color: 'var(--text-primary)', marginBottom: '8px' }}>
          Simple, honest pricing
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '40px' }}>
          Start free. Upgrade when you need more.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
        }}>
          {/* Free card */}
          <div style={{
            padding: '32px 28px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-secondary)',
            boxShadow: 'var(--shadow-card)',
            textAlign: 'left',
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>Starter</h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
              <span style={{ fontSize: '36px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>$0</span>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/ month</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>Perfect for personal use</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
              {[
                { text: '10 snippets', ok: true },
                { text: '3 tags per snippet', ok: true },
                { text: 'Title search', ok: true },
                { text: 'Public share links', ok: false },
                { text: 'Folders', ok: false },
                { text: 'Export', ok: false },
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                  {f.ok
                    ? <Check size={14} style={{ color: 'var(--orange-500)', flexShrink: 0 }} />
                    : <XIcon size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  }
                  <span style={{ color: f.ok ? 'var(--text-primary)' : 'var(--text-muted)' }}>{f.text}</span>
                </div>
              ))}
            </div>

            <Link to="/signup" style={{ textDecoration: 'none' }}>
              <Button variant="secondary" fullWidth>Get started free</Button>
            </Link>
          </div>

          {/* Pro card */}
          <div style={{
            position: 'relative',
            padding: '32px 28px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-secondary)',
            border: '1.5px solid var(--orange-500)',
            textAlign: 'left',
          }}>
            {/* Most popular badge */}
            <div style={{
              position: 'absolute',
              top: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '4px 14px',
              borderRadius: '99px',
              backgroundColor: 'var(--orange-500)',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}>
              Most popular
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>Pro</h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
              <span style={{ fontSize: '36px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>$9</span>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/ month</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>For power users and teams</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
              {[
                'Unlimited snippets',
                'Unlimited tags',
                'Full-text search',
                'Public share links',
                'Folders & collections',
                'JSON / CSV export',
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                  <Check size={14} style={{ color: 'var(--orange-500)', flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-primary)' }}>{f}</span>
                </div>
              ))}
            </div>

            <Link to="/signup" style={{ textDecoration: 'none' }}>
              <Button variant="primary" fullWidth>Upgrade to Pro →</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   SECTION 1.8 — CTA Banner
   ============================================ */
function CTABanner() {
  return (
    <section style={{
      position: 'relative',
      backgroundColor: 'var(--bg-primary)',
      padding: '80px 24px',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        height: '400px',
        background: 'radial-gradient(ellipse, rgba(249,115,22,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '560px', margin: '0 auto' }}>
        <h2 className="heading-lg" style={{ fontSize: '32px', color: 'var(--text-primary)', marginBottom: '12px' }}>
          Start saving your best prompts today.
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '28px' }}>
          Join 2,800+ developers, designers, and writers.
        </p>
        <Link to="/signup" style={{ textDecoration: 'none' }}>
          <Button variant="primary" size="lg">Create free account →</Button>
        </Link>
      </div>
    </section>
  );
}

/* ============================================
   LANDING PAGE — Assembled
   ============================================ */
export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar variant="landing" />
      <HeroSection />
      <FeatureStrip />
      <StatsStrip />
      <FeaturesSection />
      <HowItWorks />
      <PricingSection />
      <CTABanner />
      <Footer />
    </div>
  );
}
