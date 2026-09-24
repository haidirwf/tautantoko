# Security Policy

The **tautan.site** team takes the security and integrity of our codebase, merchant financial data, and user privacy very seriously. We appreciate the responsible disclosure of any vulnerabilities found within this project.

---

## Supported Versions

We actively provide security patches and updates for the following versions:

| Version | Supported          |
| :------ | :----------------- |
| 1.x.x   | :white_check_mark: |
| < 1.0.0 | :x:                |

---

## Reporting a Vulnerability

If you discover a security vulnerability, **please DO NOT create a public GitHub issue, discussion, or pull request.** Public disclosure before a patch is ready puts merchants and their customer data at risk.

Instead, please report the vulnerability privately via one of the following methods:

1. **Email:** Send details to **security@tautan.site** or **haidir@tautan.site**.
2. **GitHub Security Advisory:** Submit a private advisory directly via the GitHub repository under the **Security** > **Advisories** tab.

### What to Include in Your Report

To help us triage and resolve the issue quickly, please provide:

- **Type of Issue:** (e.g., Row Level Security (RLS) bypass, Cross-Site Scripting (XSS), Authentication bypass, Insecure Direct Object References (IDOR), or sensitive data leakage).
- **Affected Files & Routes:** Precise URLs, API endpoints, or file paths involved.
- **Proof of Concept (PoC):** Step-by-step instructions, code snippets, or HTTP requests needed to reproduce the issue.
- **Impact Assessment:** A realistic scenario detailing how the vulnerability could be exploited and who would be affected.
- **Proposed Remediation:** (Optional) Any suggestions or patches to resolve the problem.

---

## Response Timeline & SLA

When you submit a security report, you can expect:

- **Initial Acknowledgement:** Within **48 hours** confirming receipt of your report.
- **Triage & Assessment:** Within **5 business days**, validating the severity and reproduce steps.
- **Fix & Patch Release:** Critical vulnerabilities are prioritized for resolution within **7 to 14 business days**.
- **Public Disclosure:** Coordinated after a patch has been published and deployed to give merchants adequate time to update.

---

## Security Best Practices for Deployers

When self-hosting or deploying **tautan.site**:

1. **Supabase Row Level Security (RLS):** Always ensure that `supabase/schema.sql` has been executed with RLS policies enabled. Never expose the `service_role` secret key in client-side code (`VITE_` environment variables).
2. **Environment Variables:** Only use `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` on the client. Keep production secrets strictly within server-side environments.
3. **Phone Number Sanitization:** The application normalizes WhatsApp numbers into international format (`628...`). Do not bypass `sanitizeWhatsApp()` when processing customer contacts.
4. **Content Security Policy (CSP):** When deploying on cPanel or Apache, verify that `.htaccess` restricts unauthorized script origins.

---

## Acknowledgements

We gladly acknowledge and credit responsible security researchers in our project release notes and changelog (unless you prefer to remain anonymous). Thank you for helping keep tautan.site safe for Indonesian merchants!
