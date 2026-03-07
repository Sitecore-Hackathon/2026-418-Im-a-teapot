# {{NAME}} – Privacy Policy
*Last updated: {{INSERT DATE}}*

## 1. Introduction
{{NAME}} (the “Application”, “we”, “us”, or “our”) is a Sitecore Marketplace App that enables enhanced auditing and version tracking of actions performed on Sitecore Items within your Sitecore environment. This Privacy Policy explains how we collect, use, disclose, and protect personal data processed via the Application. By installing or using {{NAME}}, you acknowledge that you have read and understood this Privacy Policy.

> **Controller/Processor context**  
In the typical deployment, the **Customer** controls the Sitecore environment and acts as the **data controller**. {{NAME}} is operated to process data **on the Customer’s behalf**, and asmblii A/S acts as a **data processor**.

## 2. Data We Collect
{{NAME}} records data necessary to maintain a comprehensive audit trail:

### 2.1 User Personal Data
- Name  
- Email address  
- Username  
- IP address  
- Role / permissions  
- Timestamps and action details (e.g., create, update, delete, publish; optionally read)

### 2.2 Content & System Data
- Versioned records of Sitecore Items (created, modified, deleted)  
- Workflow state transitions and related metadata  
- System metadata required for audit integrity and diagnostics

We do **not** use this data for profiling or marketing.

## 3. Purposes of Processing
We process personal data solely to:
- Create and maintain **audit trails** of user actions
- Support **security monitoring**, incident investigation, and accountability
- Provide **compliance and governance** reporting
- Enable **operational diagnostics** and quality assurance

## 4. Legal Bases (GDPR)
Depending on the Customer’s configuration and policies, processing is supported by:
- **Art. 6(1)(b) GDPR** – necessary for the performance of the contract (App functionality)  
- **Art. 6(1)(c) GDPR** – compliance with legal obligations related to audit and security  
- **Art. 6(1)(f) GDPR** – legitimate interests in secure and compliant operations

## 5. Data Location, Storage, and Retention
- {{NAME}} stores audit data within a connected storage configured by the Customer if using the free version or to a connected storage in the **EU regsion**, unless explicitly agreed differently with the Customer, configured by asmblii A/S.  
- We do **not** transfer audit data to our own servers for processing, unless separately agreed in writing.  
- We do use Azure for the connected storage provided through asmblii A/S, having Microsoft as sub-processor as outlined in the DPA. 
- **Retention** is governed by the Customer’s policies; {{NAME}} supports configurable retention and purge routines.

## 6. Disclosures and Transfers
We do not disclose personal data to third parties except:  
- When required by law or legal process; or  
- When explicitly instructed by the Customer (e.g., integrations).  
International transfers, if any, arise from the Customer’s chosen hosting/infrastructure.

## 7. Security
We apply appropriate technical and organizational measures as described in the **Technical & Organizational Measures (TOMs)** below. Customers are responsible for securing the hosting platform and Sitecore access controls.

## 8. Data Subject Rights
{{NAME}} stores data in the Customer’s environment. Requests to exercise rights (access, rectification, erasure, restriction, objection) should be directed to the **Customer** as controller. We will assist the Customer where feasible and lawful.

## 9. Children’s Data
{{NAME}} is not intended for use by children and does not knowingly process children’s personal data.

## 10. Changes to this Privacy Policy
We may update this Privacy Policy. Material changes will be indicated by updating the “Last updated” date above. Continued use constitutes acceptance of any updates.

## 11. Contact
For privacy inquiries or DPA requests, contact:  
**asmblii A/S**  
**Email:** info@asmblii.com  
**Address:** Carl Jacobsens Vej 16C, 2.th., 2500 Valby, Denmark

---

## Technical & Organizational Measures (TOMs)

The following TOMs are designed to align with Sitecore Marketplace legal expectations and enterprise security norms. These TOMs apply to {{NAME}} when operated by or on behalf of [Your Company Name] and complement measures the Customer implements in its own Sitecore environment.

### A. Organization and Governance
- Documented information security program, periodic risk assessments and policy reviews.  
- Data protection training for personnel with access to Personal Data.  
- Change management and release controls for {{NAME}}.

### B. Access Management
- Role‑based access control; least privilege and separation of duties.  
- Strong authentication (incl. MFA) for privileged access.  
- Quarterly access recertification; immediate revocation upon role change or termination.

### C. Physical and Environmental Security
- If Processor systems are used, they are hosted on reputable providers with certified physical security; access logged and monitored.

### D. Encryption & Network Security
- TLS 1.2+ for data in transit; secure cipher suites.  
- Support for encryption at rest using Customer‑controlled storage, where applicable.  
- Network hardening, secure defaults, and least‑exposed services.

### E. Logging, Monitoring, and Auditability
- Detailed audit events: user, action type, object identifier, timestamp, IP, outcome.  
- Tamper‑evident patterns or append‑only mechanisms where feasible.  
- Time synchronization and clock integrity.

### F. Secure Development Lifecycle
- Peer code review; automated dependency scanning.  
- Secure secrets handling; no credentials in code repositories.

### G. Vulnerability & Patch Management
- Continuous vulnerability monitoring; prioritized patching for critical/high findings.  
- Third‑party component inventory and update policy.

### H. Business Continuity & Disaster Recovery
- Documented backup/restore procedures for {{NAME}} configuration where relevant.  

### I. Incident Response
- Formal IR plan; roles and communication paths defined.  
- Breach notification to Controller without undue delay and cooperation on remediation.

### J. Data Retention and Deletion
- Configurable retention aligned to Controller’s policies; secure purge routines.  
- Sanitization of temporary files and logs per policy.

### K. Sub‑processor Controls
- Contractual flow‑down of security/privacy requirements; ongoing oversight and risk assessment.  
- Maintenance of an up‑to‑date Sub‑processor list with notification mechanisms.

### L. Compliance and Assurance
- Reasonable cooperation with audits and regulatory inquiries.
