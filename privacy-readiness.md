# Latin Launchpad Child and Student Privacy Readiness

Reviewed: September 21, 2026

This is an operational review, not legal advice or a certification of compliance. It should be reviewed by qualified counsel before offering synced accounts to children under 13 or signing a school agreement.

## Current Release Position

- The service is directed in part to children under 13 because it expressly targets grades 3–8.
- Learners under 13 may use guest mode. Guest learning records remain in browser storage and are not placed in the synced learning database.
- The public service does not permit children under 13 to create, use, or be identified in synced accounts.
- Synced-account creation requires an age or adult-role declaration and confirmation that no child under 13 will use or be identified in the account.
- The service has no advertising, behavioral advertising, public profiles, chat, camera, microphone, or location feature.
- The service does not currently claim to be a FERPA school official or an approved district vendor.

## COPPA Review

The FTC states that a child-directed operator collecting personal information must provide a clear privacy notice, give direct notice to parents, obtain verifiable parental consent before collection unless an exception applies, provide parent access and deletion rights, minimize collection, use reasonable security, and retain information only as long as needed.

### Implemented

- A prominent Privacy link appears on the main app and beside account and contact collection points.
- The policy identifies data categories, purposes, providers, technical data, retention principles, access/deletion procedures, and the absence of advertising or sale.
- The policy contains a dedicated children-under-13 section.
- Signup blocks the ordinary under-13 synced-account path and directs younger learners to guest mode.
- Account creation collects an eligibility declaration and acceptance of Privacy and Terms.
- Student-name guidance requests a first name, nickname, initials, or classroom identifier rather than a full legal name.
- Parents can request review, correction, deletion, or an end to collection through the published privacy email.

### Required Before Under-13 Synced Accounts

- Obtain legal review of the full information flow and privacy notice.
- Add the operator's legal name, physical mailing address, and telephone number to the children's privacy notice.
- Implement a verifiable parental-consent method or a verified school-authorization workflow. A checkbox, role declaration, or ordinary email signup is not sufficient by itself.
- Deliver a compliant direct notice before collecting child personal information.
- Implement parent controls to review, correct, delete, and stop further collection.
- Record consent scope, method, timestamp, notices shown, and revocation status.
- Establish a written retention schedule and automated deletion process.
- Contractually assess service providers for confidentiality, security, purpose limitation, retention, and deletion.
- Add a documented incident-response and parent-notification process.

## FERPA and School Review

The Department of Education advises teachers to consult school or district administration before adopting an online tool. When education-record PII is disclosed under FERPA's school-official exception, the tool must perform an institutional service, remain under the school's direct control for use and maintenance of PII, operate consistently with the annual FERPA notice, and avoid unauthorized use or re-disclosure.

### Implemented

- `school-privacy.html` provides a current data inventory, purposes, service providers, retention approach, security summary, access/deletion process, and known limitations.
- The summary tells teachers to obtain district and IT approval.
- The summary does not claim FERPA certification or school-official status.
- The product states that student information is not sold, used for behavioral advertising, or used to create unrelated commercial profiles.

### Required Before Contracted School Use

- Create a standard district data privacy agreement or review each district's agreement.
- Define the school-authorized purpose and the school's direct-control rights.
- Define permitted data, subprocessors, locations, access controls, re-disclosure limits, and prohibition on unrelated commercial use.
- Define deletion or return at the end of the agreement and a concrete deletion timeline.
- Define incident-notification contacts and timelines.
- Add a process for school access, correction, export, and deletion requests.
- Verify applicable state student-privacy laws for each district.
- Verify that Supabase row-level security policies are enabled in the deployed project, not only present in the schema file.
- Add an in-product complete account deletion path before App Store submission.

## Sources

- FTC Children's Privacy: https://www.ftc.gov/business-guidance/privacy-security/childrens-privacy
- FTC COPPA FAQs: https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions
- Department of Education FERPA online-tools guidance: https://studentprivacy.ed.gov/faq/i-want-use-online-tool-or-application-part-my-course-however-i-am-worried-it-violation-ferpa
