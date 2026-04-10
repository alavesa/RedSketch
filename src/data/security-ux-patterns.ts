/**
 * Static knowledge base derived from the Security UX Pattern Library (uxsec.dev).
 * 34 patterns across 8 categories + 19 regulation mappings.
 *
 * Each pattern includes `relevantUISignals` — keywords that indicate the pattern
 * is relevant when found in a Figma design's node names or text content.
 */

export interface SecurityUXPattern {
  id: string;
  label: string;
  category: string;
  tags: string[];
  url: string;
  relevantUISignals: string[];
}

export interface RegulationMapping {
  id: string;
  name: string;
  fullName: string;
  patternIds: string[];
}

export const PATTERNS: SecurityUXPattern[] = [
  // ── Auth (8) ──────────────────────────────────────────
  {
    id: "auth/login",
    label: "Login Flow",
    category: "Auth",
    tags: ["OWASP A07", "CWE-307", "rate limiting", "social login", "MFA"],
    url: "https://uxsec.dev/patterns/auth/login",
    relevantUISignals: ["login", "sign in", "log in", "email", "password", "username", "forgot password", "remember me", "sign up"],
  },
  {
    id: "auth/mfa",
    label: "Multi-Factor Auth",
    category: "Auth",
    tags: ["OWASP A07", "CWE-308", "TOTP", "SMS", "backup codes"],
    url: "https://uxsec.dev/patterns/auth/mfa",
    relevantUISignals: ["verification", "verify", "2fa", "two-factor", "authenticator", "otp", "code", "sms code", "backup code"],
  },
  {
    id: "auth/password-strength",
    label: "Password Strength",
    category: "Auth",
    tags: ["OWASP A07", "CWE-521", "breach detection", "NIST"],
    url: "https://uxsec.dev/patterns/auth/password-strength",
    relevantUISignals: ["password", "new password", "confirm password", "password strength", "create password", "change password"],
  },
  {
    id: "auth/session-timeout",
    label: "Session Timeout",
    category: "Auth",
    tags: ["OWASP A07", "CWE-613", "session management"],
    url: "https://uxsec.dev/patterns/auth/session-timeout",
    relevantUISignals: ["session", "timeout", "expired", "inactive", "keep me signed in", "auto logout"],
  },
  {
    id: "auth/account-recovery",
    label: "Account Recovery",
    category: "Auth",
    tags: ["OWASP A07", "CWE-640", "password reset"],
    url: "https://uxsec.dev/patterns/auth/account-recovery",
    relevantUISignals: ["forgot password", "reset password", "recover account", "security question", "reset link", "account recovery"],
  },
  {
    id: "auth/passkeys",
    label: "Passkeys / WebAuthn",
    category: "Auth",
    tags: ["WebAuthn", "FIDO2", "passkey", "biometric", "phishing-resistant"],
    url: "https://uxsec.dev/patterns/auth/passkeys",
    relevantUISignals: ["passkey", "biometric", "face id", "touch id", "fingerprint", "webauthn", "fido"],
  },
  {
    id: "auth/oauth-consent",
    label: "OAuth Consent",
    category: "Auth",
    tags: ["OAuth", "consent", "permissions", "least privilege", "CWE-250"],
    url: "https://uxsec.dev/patterns/auth/oauth-consent",
    relevantUISignals: ["sign in with", "continue with google", "continue with apple", "authorize", "grant access", "permissions", "allow access"],
  },
  {
    id: "auth/accessible-auth",
    label: "Accessible Authentication",
    category: "Auth",
    tags: ["WCAG 2.2", "SC 3.3.8", "ARIA", "accessibility", "CAPTCHA alternative"],
    url: "https://uxsec.dev/patterns/auth/accessible-auth",
    relevantUISignals: ["captcha", "i am not a robot", "verify you are human", "accessibility", "screen reader"],
  },

  // ── Threat (3) ────────────────────────────────────────
  {
    id: "threat/breach-notification",
    label: "Breach Notification",
    category: "Threat",
    tags: ["GDPR Art. 33", "CWE-200", "breach", "incident response"],
    url: "https://uxsec.dev/patterns/threat/breach-notification",
    relevantUISignals: ["breach", "data breach", "security incident", "compromised", "unauthorized access", "notification banner"],
  },
  {
    id: "threat/phishing-warning",
    label: "Phishing Warning",
    category: "Threat",
    tags: ["OWASP A07", "CWE-601", "phishing"],
    url: "https://uxsec.dev/patterns/threat/phishing-warning",
    relevantUISignals: ["phishing", "suspicious link", "warning", "blocked", "dangerous site", "deceptive site"],
  },
  {
    id: "threat/suspicious-activity",
    label: "Suspicious Activity",
    category: "Threat",
    tags: ["OWASP A07", "CWE-778", "session"],
    url: "https://uxsec.dev/patterns/threat/suspicious-activity",
    relevantUISignals: ["suspicious", "new device", "unrecognized", "login alert", "security alert", "unusual activity"],
  },

  // ── Dark Patterns (6) ────────────────────────────────
  {
    id: "dark/confirmshaming",
    label: "Confirmshaming",
    category: "Dark Patterns",
    tags: ["EU DSA", "deceptive design", "consent"],
    url: "https://uxsec.dev/patterns/dark/confirmshaming",
    relevantUISignals: ["no thanks", "i don't want", "decline offer", "maybe later", "dismiss"],
  },
  {
    id: "dark/cookie-consent",
    label: "Cookie Consent",
    category: "Dark Patterns",
    tags: ["GDPR Art. 7", "ePrivacy", "consent", "cookies"],
    url: "https://uxsec.dev/patterns/dark/cookie-consent",
    relevantUISignals: ["cookie", "consent", "accept all", "reject all", "cookie preferences", "tracking", "analytics consent"],
  },
  {
    id: "dark/hidden-unsubscribe",
    label: "Hidden Unsubscribe",
    category: "Dark Patterns",
    tags: ["GDPR Art. 17", "right to erasure", "deletion"],
    url: "https://uxsec.dev/patterns/dark/hidden-unsubscribe",
    relevantUISignals: ["unsubscribe", "delete account", "cancel subscription", "deactivate", "close account", "remove my data"],
  },
  {
    id: "dark/privacy-zuckering",
    label: "Privacy Zuckering",
    category: "Dark Patterns",
    tags: ["GDPR Art. 5", "data minimization", "permissions"],
    url: "https://uxsec.dev/patterns/dark/privacy-zuckering",
    relevantUISignals: ["privacy settings", "data sharing", "share with partners", "improve our services", "personalization", "public by default"],
  },
  {
    id: "dark/bait-switch",
    label: "Bait & Switch",
    category: "Dark Patterns",
    tags: ["FTC Act", "deceptive design"],
    url: "https://uxsec.dev/patterns/dark/bait-switch",
    relevantUISignals: ["free trial", "upgrade", "premium", "limited time", "special offer", "unlock"],
  },
  {
    id: "dark/forced-continuity",
    label: "Forced Continuity",
    category: "Dark Patterns",
    tags: ["FTC", "subscription", "free trial"],
    url: "https://uxsec.dev/patterns/dark/forced-continuity",
    relevantUISignals: ["free trial", "auto-renew", "subscription", "billing", "cancel anytime", "credit card required"],
  },

  // ── Data (4) ──────────────────────────────────────────
  {
    id: "data/encryption",
    label: "Encryption Indicators",
    category: "Data",
    tags: ["OWASP A02", "CWE-311", "encryption", "E2E"],
    url: "https://uxsec.dev/patterns/data/encryption",
    relevantUISignals: ["encrypted", "end-to-end", "e2e", "secure connection", "lock icon", "ssl", "https"],
  },
  {
    id: "data/file-upload",
    label: "Secure File Upload",
    category: "Data",
    tags: ["OWASP A03", "CWE-434", "malware", "upload"],
    url: "https://uxsec.dev/patterns/data/file-upload",
    relevantUISignals: ["upload", "drag and drop", "attach file", "browse files", "file upload", "document upload", "image upload"],
  },
  {
    id: "data/deletion",
    label: "Data Deletion",
    category: "Data",
    tags: ["GDPR Art. 17", "CWE-212", "right to erasure"],
    url: "https://uxsec.dev/patterns/data/deletion",
    relevantUISignals: ["delete", "remove data", "erase", "right to be forgotten", "data deletion", "permanently delete"],
  },
  {
    id: "data/activity-log",
    label: "Activity & Audit Log",
    category: "Data",
    tags: ["GDPR Art. 15", "CWE-778", "OWASP A09", "audit trail"],
    url: "https://uxsec.dev/patterns/data/activity-log",
    relevantUISignals: ["activity", "log", "history", "audit", "recent activity", "access log", "device log", "security log"],
  },

  // ── OWASP (3) ─────────────────────────────────────────
  {
    id: "owasp/broken-access-control",
    label: "Broken Access Control",
    category: "OWASP",
    tags: ["OWASP A01", "CWE-284", "CWE-639", "RBAC", "IDOR"],
    url: "https://uxsec.dev/patterns/owasp/broken-access-control",
    relevantUISignals: ["admin", "role", "permission", "access denied", "unauthorized", "forbidden", "rbac", "user role"],
  },
  {
    id: "owasp/security-misconfiguration",
    label: "Security Misconfiguration",
    category: "OWASP",
    tags: ["OWASP A05", "CWE-16", "CWE-209", "headers", "debug"],
    url: "https://uxsec.dev/patterns/owasp/security-misconfiguration",
    relevantUISignals: ["error", "stack trace", "debug", "configuration", "settings", "server error", "500"],
  },
  {
    id: "owasp/logging-monitoring",
    label: "Logging & Monitoring",
    category: "OWASP",
    tags: ["OWASP A09", "CWE-778", "CWE-223", "audit", "anomaly"],
    url: "https://uxsec.dev/patterns/owasp/logging-monitoring",
    relevantUISignals: ["dashboard", "monitoring", "alerts", "notifications", "system status", "health check"],
  },

  // ── AI (3) ────────────────────────────────────────────
  {
    id: "ai/disclosure",
    label: "AI Disclosure",
    category: "AI",
    tags: ["EU AI Act", "Art. 50", "chatbot", "transparency"],
    url: "https://uxsec.dev/patterns/ai/disclosure",
    relevantUISignals: ["ai", "chatbot", "assistant", "bot", "generated by", "powered by ai", "artificial intelligence"],
  },
  {
    id: "ai/content-labeling",
    label: "AI Content Labeling",
    category: "AI",
    tags: ["EU AI Act", "Art. 50", "C2PA", "watermark", "deepfake"],
    url: "https://uxsec.dev/patterns/ai/content-labeling",
    relevantUISignals: ["ai generated", "generated content", "synthetic", "deepfake", "watermark", "ai label"],
  },
  {
    id: "ai/decision-explanation",
    label: "AI Decision Explanation",
    category: "AI",
    tags: ["EU AI Act", "GDPR Art. 22", "high-risk AI", "explainability"],
    url: "https://uxsec.dev/patterns/ai/decision-explanation",
    relevantUISignals: ["recommendation", "suggested", "why this", "how we decided", "appeal", "human review", "ai decision"],
  },

  // ── Industrial (4) ────────────────────────────────────
  {
    id: "industrial/operator-auth",
    label: "Operator Authentication",
    category: "Industrial",
    tags: ["IEC 62443", "OT security", "badge", "biometric", "emergency"],
    url: "https://uxsec.dev/patterns/industrial/operator-auth",
    relevantUISignals: ["operator", "badge", "swipe", "plant", "control room", "hmi login", "shift handover"],
  },
  {
    id: "industrial/safety-critical",
    label: "Safety-Critical Confirmation",
    category: "Industrial",
    tags: ["IEC 61511", "safety", "emergency shutdown", "override"],
    url: "https://uxsec.dev/patterns/industrial/safety-critical",
    relevantUISignals: ["emergency", "shutdown", "override", "confirm action", "safety", "critical action", "hold to confirm"],
  },
  {
    id: "industrial/alarm-fatigue",
    label: "Alarm Fatigue Management",
    category: "Industrial",
    tags: ["ISA-18.2", "EEMUA 191", "alarm management", "HMI"],
    url: "https://uxsec.dev/patterns/industrial/alarm-fatigue",
    relevantUISignals: ["alarm", "alert", "warning", "critical alarm", "alarm list", "acknowledge", "suppress"],
  },
  {
    id: "industrial/navigation-levels",
    label: "Navigation & Levels of Detail",
    category: "Industrial",
    tags: ["ISA-101", "HMI", "navigation", "drill-down"],
    url: "https://uxsec.dev/patterns/industrial/navigation-levels",
    relevantUISignals: ["overview", "drill down", "detail view", "plant view", "unit view", "loop view", "hmi"],
  },

  // ── Governance (3) ────────────────────────────────────
  {
    id: "governance/design-review",
    label: "Security Design Review",
    category: "Governance",
    tags: ["IEC 62443", "ISO 27001", "review process", "checklist"],
    url: "https://uxsec.dev/patterns/governance/design-review",
    relevantUISignals: ["review", "approval", "checklist", "sign-off", "design review", "security review"],
  },
  {
    id: "governance/change-management",
    label: "Change Management",
    category: "Governance",
    tags: ["IEC 62443", "ISO 27001", "ITIL", "rollback"],
    url: "https://uxsec.dev/patterns/governance/change-management",
    relevantUISignals: ["change request", "deploy", "rollback", "release", "version", "changelog", "feature flag"],
  },
  {
    id: "governance/compliance-audit",
    label: "Compliance Audit Workflow",
    category: "Governance",
    tags: ["NIS2", "DORA", "GDPR", "audit", "gap analysis"],
    url: "https://uxsec.dev/patterns/governance/compliance-audit",
    relevantUISignals: ["audit", "compliance", "evidence", "gap analysis", "assessment", "certification"],
  },
];

export const REGULATIONS: RegulationMapping[] = [
  { id: "gdpr", name: "GDPR", fullName: "General Data Protection Regulation (EU)", patternIds: ["auth/login", "auth/mfa", "auth/account-recovery", "dark/cookie-consent", "dark/privacy-zuckering", "dark/hidden-unsubscribe", "data/encryption", "data/file-upload", "data/deletion", "data/activity-log", "threat/breach-notification", "auth/oauth-consent", "governance/compliance-audit"] },
  { id: "ccpa", name: "CCPA", fullName: "California Consumer Privacy Act (US)", patternIds: ["dark/cookie-consent", "dark/privacy-zuckering", "dark/hidden-unsubscribe", "data/deletion", "data/encryption", "auth/oauth-consent"] },
  { id: "soc2", name: "SOC 2", fullName: "Service Organization Control Type 2", patternIds: ["auth/login", "auth/mfa", "auth/password-strength", "auth/session-timeout", "data/encryption", "data/file-upload", "owasp/broken-access-control", "owasp/security-misconfiguration", "owasp/logging-monitoring", "data/activity-log"] },
  { id: "iso27001", name: "ISO 27001", fullName: "Information Security Management System", patternIds: ["auth/login", "auth/mfa", "auth/password-strength", "auth/session-timeout", "auth/account-recovery", "data/encryption", "data/file-upload", "data/deletion", "owasp/broken-access-control", "owasp/security-misconfiguration", "owasp/logging-monitoring", "threat/breach-notification", "threat/suspicious-activity", "data/activity-log", "governance/design-review", "governance/change-management", "governance/compliance-audit"] },
  { id: "pci", name: "PCI DSS 4.0", fullName: "Payment Card Industry Data Security Standard v4.0", patternIds: ["auth/login", "auth/mfa", "auth/password-strength", "auth/session-timeout", "auth/passkeys", "data/encryption", "data/file-upload", "data/activity-log", "owasp/broken-access-control", "owasp/logging-monitoring", "owasp/security-misconfiguration"] },
  { id: "ftc", name: "FTC Act", fullName: "Federal Trade Commission Act (US) — Deceptive Practices", patternIds: ["dark/confirmshaming", "dark/cookie-consent", "dark/hidden-unsubscribe", "dark/bait-switch", "dark/forced-continuity", "dark/privacy-zuckering"] },
  { id: "euaiact", name: "EU AI Act", fullName: "EU Artificial Intelligence Act — Article 50 Transparency (Aug 2026)", patternIds: ["ai/disclosure", "ai/content-labeling", "ai/decision-explanation", "auth/accessible-auth", "data/activity-log", "owasp/logging-monitoring"] },
  { id: "usai", name: "US AI Laws", fullName: "Colorado AI Act + California AI Transparency Act (2026)", patternIds: ["ai/disclosure", "ai/content-labeling", "ai/decision-explanation"] },
  { id: "iec62443", name: "IEC 62443", fullName: "Industrial Automation & Control System Security", patternIds: ["industrial/operator-auth", "industrial/safety-critical", "industrial/alarm-fatigue", "industrial/navigation-levels", "auth/mfa", "auth/session-timeout", "owasp/broken-access-control", "owasp/logging-monitoring", "governance/design-review", "governance/change-management"] },
  { id: "iec61511", name: "IEC 61511", fullName: "Safety Instrumented Systems for Process Industries", patternIds: ["industrial/safety-critical", "industrial/alarm-fatigue", "industrial/operator-auth"] },
  { id: "isa182", name: "ISA-18.2", fullName: "Management of Alarm Systems for Process Industries (EEMUA 191)", patternIds: ["industrial/alarm-fatigue", "owasp/logging-monitoring", "owasp/security-misconfiguration"] },
  { id: "isa101", name: "ISA-101", fullName: "Human Machine Interfaces for Process Industries", patternIds: ["industrial/navigation-levels", "industrial/alarm-fatigue", "industrial/operator-auth", "industrial/safety-critical"] },
  { id: "fido2", name: "WebAuthn / FIDO2", fullName: "Web Authentication & Fast Identity Online", patternIds: ["auth/passkeys", "auth/login", "auth/mfa", "auth/accessible-auth"] },
  { id: "wcag", name: "WCAG 2.2", fullName: "Web Content Accessibility Guidelines 2.2", patternIds: ["auth/accessible-auth", "auth/login", "auth/mfa", "auth/passkeys", "auth/session-timeout", "dark/cookie-consent", "industrial/alarm-fatigue"] },
  { id: "nis2", name: "NIS2", fullName: "Network and Information Security Directive 2 (EU)", patternIds: ["auth/mfa", "auth/session-timeout", "auth/passkeys", "threat/breach-notification", "threat/suspicious-activity", "data/encryption", "data/activity-log", "owasp/broken-access-control", "owasp/logging-monitoring", "owasp/security-misconfiguration", "industrial/operator-auth", "industrial/alarm-fatigue", "industrial/navigation-levels", "threat/phishing-warning", "governance/design-review", "governance/change-management", "governance/compliance-audit"] },
  { id: "dora", name: "DORA", fullName: "Digital Operational Resilience Act (EU — Financial Sector)", patternIds: ["auth/mfa", "auth/session-timeout", "auth/passkeys", "threat/breach-notification", "threat/suspicious-activity", "data/encryption", "data/activity-log", "owasp/broken-access-control", "owasp/logging-monitoring", "owasp/security-misconfiguration", "threat/phishing-warning", "governance/change-management", "governance/compliance-audit"] },
  { id: "cra", name: "CRA", fullName: "Cyber Resilience Act (EU — Products with Digital Elements)", patternIds: ["auth/login", "auth/mfa", "auth/password-strength", "data/encryption", "data/file-upload", "data/deletion", "threat/breach-notification", "owasp/security-misconfiguration", "owasp/logging-monitoring", "industrial/operator-auth", "industrial/safety-critical", "threat/phishing-warning"] },
  { id: "eaa", name: "EAA", fullName: "European Accessibility Act (EU — Directive 2019/882)", patternIds: ["auth/accessible-auth", "auth/login", "auth/mfa", "auth/passkeys", "auth/account-recovery", "dark/cookie-consent", "dark/confirmshaming", "data/deletion", "data/encryption", "threat/breach-notification"] },
  { id: "iso42001", name: "ISO/IEC 42001", fullName: "AI Management System — Responsible AI Governance (2023)", patternIds: ["ai/disclosure", "ai/content-labeling", "ai/decision-explanation", "governance/design-review", "governance/change-management", "governance/compliance-audit", "data/activity-log", "owasp/logging-monitoring", "owasp/security-misconfiguration"] },
];

/**
 * Build a compact knowledge base string for the agent's system prompt.
 */
export function buildPatternKnowledgeBase(): string {
  const lines: string[] = [];

  lines.push("# Security UX Pattern Library (uxsec.dev) — 34 Patterns\n");

  const categories = [...new Set(PATTERNS.map((p) => p.category))];
  for (const cat of categories) {
    const patterns = PATTERNS.filter((p) => p.category === cat);
    lines.push(`## ${cat}`);
    for (const p of patterns) {
      lines.push(`- **${p.label}** [${p.id}] — Tags: ${p.tags.join(", ")} — URL: ${p.url}`);
      lines.push(`  UI signals: ${p.relevantUISignals.join(", ")}`);
    }
    lines.push("");
  }

  lines.push("# Regulation Mappings (19 Regulations)\n");
  for (const reg of REGULATIONS) {
    const patternLabels = reg.patternIds
      .map((id) => PATTERNS.find((p) => p.id === id)?.label ?? id)
      .join(", ");
    lines.push(`- **${reg.name}** (${reg.fullName}): ${patternLabels}`);
  }

  return lines.join("\n");
}
