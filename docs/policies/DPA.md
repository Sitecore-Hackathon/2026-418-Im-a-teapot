# Apparatus CIA – Data Processing Addendum (DPA)
*Last updated: March 7 2026*

This Data Processing Addendum ("DPA") is incorporated into and forms part of the agreement (the “Agreement”) between **asmblii A/S** ("Processor") and the **Customer** ("Controller") regarding the use of the Sitecore Marketplace App **Apparatus CIA**.

## 1. Definitions
- **Applicable Data Protection Law**: Means Regulation (EU) 2016/679 (EU GDPR); the Danish Data Protection Act and other Danish laws implementing or supplementing the GDPR; and, to the extent applicable to the Processing of Personal Data under this DPA, other data protection or privacy laws that apply to the parties or the Personal Data, including (where relevant) the UK GDPR and the Data Protection Act 2018.
- **Controller**, **Processor**, **Personal Data**, **Processing**, **Data Subject**, **Supervisory Authority**: As defined in the GDPR.  
- **Sub‑processor**: A third party engaged by Processor to process Personal Data on behalf of Controller.

## 2. Subject Matter, Nature, and Purpose
Apparatus CIA processes Personal Data to provide **audit trail and version tracking** of actions performed on Sitecore Items, including user actions (create, update and delete optionally publish and read) and associated metadata (timestamps, IP, role, user). Processing is limited to what is necessary to deliver the Application’s functionality, support security, governance, and compliance reporting, and provide diagnostics and maintenance.

## 3. Duration
Processing continues for the term of the Agreement and ceases upon uninstallation/termination, subject to Section 12 (Return or Deletion).

## 4. Categories of Data Subjects and Data
- **Data Subjects**: Sitecore users with backend access (e.g., Content Authors, Marketers, Admins, Developers).  
- **Personal Data**: Name, Email, Username, IP Address, Roles, timestamps, and action details.  
- **Content/Metadata**: Versioned Sitecore Item data and workflow/state metadata necessary for audit integrity.

## 5. Roles of the Parties
The Controller determines the purposes and means of the processing. By choosing to deploy and use the Application, the Controller instructs the Processor to process Personal Data strictly as required for the functionality described in Section 2. The Application processes such data only within its own features and solely for those purposes. Any access to, or export of, Personal Data from the Application is limited to users within the Controller’s organization who have been granted the necessary permissions, as configured and controlled exclusively by the Controller.

## 6. Processor Obligations
Processor shall:
1. Process Personal Data solely as outlined in 5. Roles of the parties.  
2. Ensure personnel are subject to confidentiality obligations.  
3. Implement and maintain **Technical & Organizational Measures (TOMs)** (Appendix 1).  
4. Assist Controller with Data Subject requests, impact assessments, and consultations with Supervisory Authorities, as reasonably required on a Time and Material basis at the processeors default hourly rate.  
5. Notify Controller **without undue delay** after becoming aware of a personal data breach affecting Apparatus CIA.  
6. Make available information necessary to demonstrate compliance and reasonably cooperate with audits on a Time and Material basis at the processeors default hourly rate as per Section 10.

## 7. Controller Obligations
Controller is responsible for: (a) providing lawful instructions; (b) ensuring a valid legal basis; (c) configuring retention and deletion within the application; (d) securing its hosting environment for the application data if using the free version of the application; and (e) fulfilling Data Subject rights requests.

## 8. Sub‑processing
Processor can engage Sub‑processors for audit data storage/processing without Controller’s prior authorization. Where Sub‑processors are engaged, Processor will: (i) impose data protection terms no less protective than this DPA.

### 8.1 Use of Microsoft Azure as Sub‑processor

The Processor uses **Microsoft Corporation** (“Microsoft”) as a Sub‑processor solely for the provision of cloud infrastructure services necessary to host and operate components of the Application. Microsoft provides compute, storage, and networking capabilities through the **Microsoft Azure** cloud platform.

All Personal Data processed by the Application that is handled by Microsoft is stored and processed **exclusively within Microsoft Azure datacenters located in the European Union**, unless the Controller explicitly configures or requests otherwise. The default hosting region is within the **EU** to support compliance with GDPR data residency requirements.

Microsoft acts as a Sub‑processor under the terms of the **Microsoft Data Protection Addendum (DPA)** applicable to Azure services, which includes EU Standard Contractual Clauses (SCCs), GDPR commitments, and security measures. Microsoft’s responsibilities include maintaining physical and environmental security, logical access controls, and infrastructure‑level safeguards consistent with industry standards.

The Processor remains responsible for ensuring that Microsoft provides sufficient guarantees to implement appropriate technical and organizational measures and will maintain oversight of Microsoft’s compliance as required under GDPR Article 28. The Controller may request an up‑to‑date copy of the Sub‑processor list at any time.

## 9. International Transfers
Apparatus CIA is designed to process audit data within the Controller’s Sitecore environment and store it at an external data storage. Any international transfers result from the Controller’s chosen hosting, integrations and external data storage. Transfers initiated by the Processor, when the data storage is controlled by the Processor in the non-free versions of the application, the transfer is implemented with a valid transfer mechanism as required by law.

## 10. Audit and Information Rights
Upon reasonable prior notice, Processor will, on a Time and Material basis at the processeors default hourly rate, make available relevant documentation and cooperate with Controller’s good‑faith audits or assessments (including questionnaires) no more than annually, unless otherwise required by law or following a breach. Audits must minimize disruption, preserve confidentiality, and exclude unrelated facilities or data.

## 11. Security Incidents
Processor will notify Controller without undue delay upon confirming a breach impacting Personal Data processed by Apparatus CIA, including available details on nature, categories of data, likely consequences, and measures taken or proposed.

## 12. Return or Deletion
Upon termination or upon Controller’s written request, Processor will cease processing and will (to the extent reasonably possible) delete or return Personal Data in its possession, if any. Data held within the Controller’s environment will be deleted or retained per the Controller’s policies.

## 13. Liability and Conflict
This DPA forms part of the terms under which the Controller installs and uses the Application from the Sitecore Marketplace. To the extent permitted by applicable law, each party’s liability in relation to this DPA shall be governed by the liability terms set out in the Application’s Terms of Use or, where no such terms exist, shall be limited to the extent permitted under applicable Danish law. In the event of any conflict between this DPA and other terms applicable to the Application, this DPA shall prevail solely with respect to the Processing of Personal Data.

## 14. Governing Law and Jurisdiction
Governing Law and Jurisdiction. This DPA, and any dispute or claim (including non‑contractual disputes or claims) arising out of or in connection with it, shall be governed by and construed in accordance with the laws of Denmark. Each party irrevocably agrees that the courts of Denmark shall have exclusive jurisdiction to settle any dispute or claim arising out of or in connection with this DPA.

---

## Appendix 1 – Technical & Organizational Measures (TOMs)

These TOMs align with Sitecore Marketplace legal expectations and industry best practices. They apply to the Processor’s operation of Apparatus CIA and complement the Controller’s controls within Sitecore.

### A. Organization and Governance
- Documented information security program, periodic risk assessments and policy reviews.  
- Data protection training for personnel with access to Personal Data.  
- Change management and release controls for Apparatus CIA.

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
- Documented backup/restore procedures for Apparatus CIA configuration where relevant.  

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
