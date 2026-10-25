# Tools Landscape and Digital Evidence Requirements for an ICRA/ILSM Field Checklist App (US, as of Oct 2026)

Method note: Research used web search only. Direct page fetches failed for several vendor domains (soleran.com, incue.app, census.gov returned DNS/proxy errors), so some vendor details come from search-result summaries of those pages, not full reads. Vendor feature claims are marketing and not independently verified. Anything I could not confirm exists is marked UNVERIFIED.

## 1. Purpose-built ICRA / ILSM / healthcare-construction tools (and pressure monitoring vendors)

### Takeaway
A small, fragmented set of purpose-built products exists, and nearly all of them are sold to the hospital (facilities, infection prevention, EOC/compliance) as permit, rounding or CMMS modules. None I found is a contractor-first, offline-first field checklist that combines ICRA, ILSM, barrier/firestop, and pressure readings with supervisor co-sign. Pressure-monitor vendors log readings to the cloud but do not handle the checklist, sign-off, and closeout side.

### Cited Findings
**Hospital-facing ICRA/ILSM permit and rounding software (verified to exist via vendor pages)**
- Soleran "Interim Life Safety Measure Manager": sends assessments to all applicable parties to complete daily or weekly monitoring inspections on any mobile device until the project is closed out; dashboards by area and by accrediting standard. Soleran also publishes a PCRA/ICRA/ILSM guide, which suggests it covers PCRA/ICRA as well. Pricing not found. (Full page fetch failed; details from search summary.) — [Soleran ILSM Manager](https://www.soleran.com/applications/interim-life-safety-measure-manager); [Soleran PCRA/ICRA/ILSM guide](https://www.soleran.com/blog/a-practical-guide-to-pcra-icra-ilsm-in-healthcare-construction)
- INCUE (incue.app): "ICRA Automation Solutions." It gives real-time visibility into containment areas, digitizes the paper compliance process, and runs in a web browser on desktop, laptop, tablet and phone, plus Android and iOS. It also offers sensor-based monitoring with early warning of airborne contamination from construction. No ILSM or firestop mentioned. Pricing not found. — [INCUE](https://incue.app/)
- iFactory: markets an ICRA module from pre-construction classification (Class I–IV) through post-construction sign-off, with "real-time barrier tracking," compliance audit trails, mobile access and "one-click regulatory reporting." The page sits under a pharmaceuticals industry path, so it looks like a general industrial/CMMS vendor. Pricing not found. — [iFactory ICRA checklist page](https://ifactoryapp.com/industries/pharmaceuticals/icra-checklist-healthcare-construction-renovation)
- Oxmaint (CMMS): markets software that digitizes ILSM risk assessments, fire watch management, egress monitoring, barrier inspections and hot work permits. Its pages also push "digital technician signatures and timestamps" as making records survey-ready. Pricing not found. — [Oxmaint ILSM](https://oxmaint.com/industries/healthcare/interim-life-safety-measures-hospital-construction); [Oxmaint TJC EC documentation](https://oxmaint.com/industries/healthcare/joint-commission-compliance-cmms-ec-standard-documentation)
- Coast (CMMS): a review blog says its "Compliance Pro" module digitizes permitting, including ICRA, ILSM/ALSM and PCRA permits. This comes from the vendor's own blog and is unverified. — [Coast healthcare CMMS blog](https://coastapp.com/blog/healthcare-cmms/)
- CRx Compliance: its product list includes "CRx Assisted ILSM," digital rounds and digital permits. — [CRx Compliance](https://crxcompliance.com/)
- SafeQual (infection prevention software): says it streamlines the ICRA process and digitizes infection-control rounding. The buyer is infection prevention, not contractors. — [SafeQual Infection Prevention](https://www.safequal.net/infection-prevention/)
- Veoci "EOC Rounding": focuses on rounds, not permits. Records are automatically organized for Joint Commission, CMS or DNV audits, and submitting a round can create work orders. — [Veoci EOC Rounding](https://veoci.com/hospitals-healthcare/eoc-rounding)
- Other EOC rounding tools, with no ICRA/ILSM module seen in the search results: Walsh Rounds Tracker, FSI, ObservSMART, Performance Health Partners, and VA "Performance Logic Rounding Center." — [Walsh Rounds Tracker](https://walshintegrated.com/products/rounds-tracker-2/); [FSI](https://www.fsiservices.com/); [ObservSMART](https://www.observsmart.com/environment-of-care-safety-and-how-observsmart-can-help/); [VA TRM entry](https://www.oit.va.gov/Services/TRM/ToolPage.aspx?tid=6726)
- Hospitals also build their own tools: UC Davis Health tracks ICRAs in Smartsheet and is starting to use Smartsheet for ILSMs. — [UC Davis Health ILSM](https://health.ucdavis.edu/fire/interim-life-safety-measures)
- Life Safety Express is a consulting and training firm (ILSM audits, barrier management review, staff training), not a software vendor. Its "ILSM technology solutions" page describes generic capabilities such as alerts, task tracking and a central repository for TJC surveys. — [Life Safety Express ILSM tech](https://lifesafetyexpress.com/ilsm-inerim-life-safety-measures/ilsm-technology-solutions/); [LSE ILSM audit](https://lifesafetyexpress.com/resources/ilsm-audit-compliance/)

**Free templates and non-software tools**
- The ASHE ICRA 2.0 toolkit and sample permit are available to the public. These are document templates, not an app. — [ASHE ICRA 2.0](https://www.ashe.org/icra2)
- UMMS publishes an electronic ICRA 2.0 permit template (activity type A–D, risk group, Class I–V, controls, verification, approvals) on Mitti and in the SafetyCulture library. — [Mitti UMMS ICRA 2.0](https://mitti.com/library/health-care/umms-icra-2-0-infection-control-risk-assessment-and-permit-ijk0cnin7ukmzcsi)
- The "ICRA For Construction" App Store app is a training video game, not a permit tool. The "ICRA 2026" app is for the IEEE robotics conference and is unrelated. — [ICRA For Construction](https://apps.apple.com/us/app/icra-for-construction/id1299114197); [ICRA 2026](https://apps.apple.com/us/app/icra-2026/id6769791208)

**Firestop and barrier documentation tools (adjacent; contractor-facing)**
- Fieldwire offers a firestop workflow: photograph the installation, choose the UL system from dropdowns, link Hilti-ordered QR codes to each penetration, and produce reports with checklists, photos, UL systems and location markers. — [Fieldwire firestop use case](https://www.fieldwire.com/usecase/firestop-documentation/)
- Other firestop tools that exist (vendor pages): Onetrace (time-stamped photos, installer declarations, multi-stage approval and corrective actions back to installers, per a search summary), FireQA from New Zealand (before/during/after photos, floor-plan pins), Neurobird (penetration, system number and photo on one record), FireArrest app, and Multivista (AI detection of unsealed penetrations that generates tasks). — [FireQA](https://www.fireqa.com/firestopping-installs); [Neurobird](https://neurobird.com/firestopping/); [FireArrest](https://firearrest.com/firestopping-app/); [Multivista](https://www.multivista.com/firestopping/); [Emergent firestop inspection](https://www.emergent.tech/blog/firestop-inspection)
- I did not find a tool that combines firestop/barrier documentation with ICRA/ILSM in a healthcare context. — (search gap; see Gaps)

**Continuous pressure-monitoring vendors with logging**
- Omni CleanAir Omni IQ G720: a differential pressure monitor that streams live readings to a dashboard, with automated logging and alerts for ICRA. It covers containment, anteroom and ambient spaces from one unit. The vendor says the OmniGuard 6 is discontinued and recommends the G700 series. The vendor also claims "ICRA 2.0 now explicitly mandates digital air pressure monitoring with continuous documentation." That claim is unverified and should be checked against the ASHE text. — [Omni IQ G720](https://shop.omnicleanair.com/products/omni-iq-g720-differential-pressure-monitor); [OmniGuard 6 page](https://shop.omnicleanair.com/products/new-omniguard-6-differential-pressure-monitor)
- Spycor "OmniGuard 6" (a vendor blog): cellular and Wi-Fi connectivity, about 6 months of onboard storage, and log retrieval by thermal printer, USB, PC or automated daily email. — [Spycor blog](https://spycorbuilding.com/blog/best-differential-pressure-monitors-for-icra-compliance-in-2026-omniguard-6/)
- Sonicu: wireless room-pressure monitors that send data to the cloud over 4G, 900 MHz or Wi-Fi, with onboard memory for "years" of data during outages and alerts by text, phone or email. Its literature names monitoring pressure between occupied and construction areas as a use. Portable kits are available. — [Sonicu differential air pressure](https://www.sonicu.com/differential-air-pressure-solutions); [Sonicu monitoring kits datasheet](https://www.sonicu.com/hubfs/Sales_Collateral/Data%20Sheets/Applications/DataSheet_DifferentialAirPressureMonitoring_MonitoringKits_vOct2025.pdf.pdf)
- Abatement Technologies RPM-RT1: a wall-mount differential pressure monitor (BACnet, 24V) for isolation rooms and ICRA zones. Seen only on a third-party retailer page. — [US Cleaning Tools pressure monitors](https://uscleaningtools.com/collections/pressure-monitors)
- Aretas: a differential pressure monitoring product page exists. — [Aretas](https://www2.aretas.ca/differential-pressure-monitoring/)
- Paper is still common: Northwell publishes a manual negative-air monitoring log with three readings per day plus time and initials, and cites >0.03 in. w.g. (7 Pa) for high-risk anterooms. — [Northwell negative air log](https://www.northwell.edu/sites/northwell.edu/files/2024-01/negative-air-monitoring-log.pdf)

### Inferences
- The incumbents sell to the hospital owner, as permit, rounding or CMMS modules. The contractor's superintendent or foreman usually works from the hospital's permit and fills paper logs, or the hospital's tool if given access. That leaves room for a contractor-first app that exports in the format the owner and surveyor expect.
- Pressure monitors already produce continuous logs. The app does not need to compete with them. Letting users attach or import a monitor's export (CSV/PDF), or record a spot instrument reading under each checklist item, would cover the gap at low cost.
- The firestop tools (Fieldwire, Onetrace, FireQA) show the field pattern contractors already accept: photo, QR or location pin, system ID, and approval with send-back. The startup's "rework request" and "supervisor co-sign" match this pattern and should feel familiar.

### Gaps
- UNVERIFIED or not found in this research: "Facility Health," "Smart Compliance," "BuildingReports" (as a barrier-management product), "TMS" ICRA module, Accruent ICRA/ILSM module, and Origami Risk ICRA/ILSM module. Searches returned nothing that confirmed ICRA/ILSM features for these names. Do not cite them without checking the vendors' sites.
- Triatek, TSI, Setra, and an Antec "Pressure Guardian": none appeared in pressure-monitor searches. Treat them as UNVERIFIED for construction ICRA cloud logging.
- No public pricing for Soleran, INCUE, iFactory, Oxmaint, CRx, SafeQual or Veoci.
- No independent reviews (G2/Capterra) found for the purpose-built ICRA/ILSM tools.

## 2. General construction field platforms: how they handle ICRA/ILSM, templates, pricing

### Takeaway
General platforms (Procore, Fieldwire, Autodesk Build, SafetyCulture, Raken) can host a custom ICRA/ILSM checklist, but none ships a native healthcare workflow (ICRA class logic, ILSM triggers, IP co-sign, pressure readings). SafetyCulture has user-contributed ICRA templates. Pricing runs from free or about $24/user/month (SafetyCulture) to five figures per year (Procore).

### Cited Findings
- SafetyCulture's public library has ICRA templates contributed by healthcare users, for example "Mercy Muskegon – ICRA Checklist" and "LWH ICRA Assessment." They cover Type A–D activities to Class I–IV and controls such as HVAC isolation, sealing penetrations, dust mats, HEPA and negative air. Download counts are small. — [SafetyCulture Mercy Muskegon ICRA](https://safetyculture.com/library/health-care/mercy-muskegon-icra-checklist); [SafetyCulture LWH ICRA](https://safetyculture.com/library/health-care/lwh-icra-assessment)
- No ICRA-specific template was found for Procore or Fieldwire. Both would need a custom checklist or form built. — (search result synthesis; [Procore library](https://www.procore.com/library/construction-framing-inspection-checklist) shows generic inspection templates only)
- Fieldwire pricing is public: Basic is free, Pro is $39/user/month billed annually, and Business and Business Plus run about $64–$89/user/month (third-party summaries). — [constructionbids.ai Fieldwire review](https://constructionbids.ai/blog/fieldwire-review-pricing-contractors-2026); [ITQlick Fieldwire vs Procore](https://www.itqlick.com/compare/fieldwire/procore)
- SafetyCulture: a free tier for up to 10 users, and Premium at about $24/user/month billed annually ($29 monthly). — [makesafetyeasy pricing 2026](https://makesafetyeasy.com/blog/construction-safety-software-pricing-2026)
- Raken: pricing is unclear and sources conflict. One says quote-based with Basic at about $23/user/month, another says about $59/user/month with a 3-user minimum, and a third gives roughly $12–$46. — [dailybuild pricing guide](https://dailybuild.co/construction-software-pricing-guide); [makesafetyeasy](https://makesafetyeasy.com/blog/construction-safety-software-pricing-2026)
- Procore is priced on annual construction volume, not per user. Estimates run about $10k–$50k+ per year, with renewal increases of 10–14% reported. Sources conflict on how the price is built. — [dailybuild](https://dailybuild.co/construction-software-pricing-guide); [ITQlick](https://www.itqlick.com/compare/fieldwire/procore)
- Autodesk Build: the Autodesk page lists per-user plans at about $1,625–$1,740 per user per year ($135–$145/month), plus an unlimited-users option by quote. — [Autodesk Build pricing](https://getconstructioncloud.autodesk.com/buy-autodesk-build); [Workyard ACC cost](https://www.workyard.com/answers/how-much-does-autodesk-build-cost)
- Offline capability:
  - Procore: works offline only for items opened or downloaded earlier.
  - Fieldwire: offline plans, tasks, forms, checklists and photos on iOS and Android, but not in the Windows app.
  - Raken: offline reports, photos and time cards, but only for recent or preselected projects.
  - SafetyCulture: offline is described as limited.
  — [ABLEMKR offline construction apps](https://ablemkr.com/offline-construction-app-what-works-without-signal/); [Fieldwire photo management](https://www.fieldwire.com/blog/construction-photo-management-software/); [dailybuild](https://dailybuild.co/construction-software-pricing-guide)
- Other adjacent tools named in field-app roundups include GoCanvas, Fluix, CompanyCam, GoAudits and Salus. — [Fluix inspection software](https://fluix.io/blog/best-construction-inspection-software); [GoAudits](https://goaudits.com/blog/construction-photo-documentation-software-app/); [CompanyCam](https://companycam.com/resources/blog/construction-photo-documentation-software-what-to-look-for-and-why-it-matters); [Salus offline](https://www.salussafety.io/us/platform/offline)

### Inferences
- These platforms are generic, so a hospital job's ICRA/ILSM documentation lives in a custom form someone on the GC's team must build and maintain. A prebuilt ICRA 2.0 / ILSM template pack, with class-to-controls logic and an IP/facilities co-sign, is a concrete differentiator.
- On price, a single-purpose app at or below SafetyCulture/Fieldwire Pro levels (about $24–$39/user/month) or a per-project fee (Procore has used per-project anchors near $375/month in one report) would sit below the GC's Procore spend. It could be sold as an add-on that exports PDFs into Procore rather than a replacement.

### Gaps
- Could not confirm whether Procore, Autodesk Build or Bluebeam offer any ICRA/ILSM template in their marketplaces. None surfaced.
- Bluebeam and GoCanvas were not researched in depth. No healthcare-specific workflows found.
- Could not confirm whether Autodesk Build checklist signatures work offline.

## 3. User sentiment on field usability (offline, gloves, photos, sign-off, reporting)

### Takeaway
Review data consistently names mobile slowness, too many taps, a steep learning curve, and weak offline support (especially in Procore) as field pain points. Superintendent and sub adoption is the biggest barrier. I found no Reddit or App Store evidence specifically about gloves or button size, and few reviews about checklist sign-off.

### Cited Findings
- Procore: reviewers often report performance and speed issues on mobile and with large files. A Capterra aggregate shows 66% of 145 negative reviews cite slow performance or lag. — [Capterra Procore reviews](https://www.capterra.com/p/56250/Procore/reviews/); [Connecteam Procore review](https://connecteam.com/reviews/procore/)
- Procore App Store reviewer: when making observations inside inspections, they could not see the linked equipment and had to type the unit tag or switch to the web. — [Procore App Store reviews](https://apps.apple.com/us/app/procore/id374930542?see-all=reviews&platform=iphone)
- G2 and Capterra summaries for Procore: "too many steps to complete simple tasks," hard to navigate, and a steep learning curve. — [G2 Procore reviews](https://www.g2.com/products/procore/reviews); [Capterra Procore](https://www.capterra.com/p/56250/Procore/)
- Workyard on Procore: "limited offline functionality, frequent re-downloads, and issues with iPad optimization." — [Workyard Procore review](https://www.workyard.com/compare/procore-review)
- A Capterra reviewer on adoption: "the biggest hurdle ... is getting subcontractors, vendors, and superintendents to buy-in to new technology." — [Capterra Procore reviews](https://www.capterra.com/p/56250/Procore/reviews/)
- Ratings: G2 rates SafetyCulture 4.6/5 (241 reviews) and Procore 4.6/5 (4,100+ reviews), per a third-party comparison. — [ustechautomations comparison](https://ustechautomations.com/resources/blog/automate-procore-alternatives-for-construction-firms-2026)
- Offline failure pattern, from a vendor blog: when an app needs a connection, a dead spot means crews fall back to paper or memory. A cached read-only view is not enough, and offline capture with auto-sync is the requirement. — [ABLEMKR](https://ablemkr.com/offline-construction-app-what-works-without-signal/); [Scanmanifold offline photo](https://www.scanmanifold.com/blog-posts/offline-construction-photo-documentation-app)

### Inferences
- Hospital interiors (basements, shielded imaging suites, stairwells) are classic dead zones. Offline-first with a local queue, and capture timestamps preserved through sync, is a must-have rather than a nice-to-have.
- Low-tap item completion (one-tap check, photo-first capture, large hit targets) answers the most common review complaints, even though I found no glove-specific evidence.

### Gaps
- No Reddit threads (r/Construction, r/ConstructionManagers) or App Store reviews specifically about gloves, button size, or checklist sign-off friction surfaced. This needs primary user interviews.
- No reviews found for SafetyCulture's or Fieldwire's checklist sign-off flow specifically.

## 4. Evidentiary requirements: e-signatures, timestamps, audit trails, photos, retention, HIPAA

### Takeaway
ESIGN and UETA give e-signatures legal effect if four conditions are met: the signer intended to sign, the parties consented (implied consent is enough between businesses), the signature is tied to the record, and the record can be retained and accurately reproduced. 21 CFR Part 11 is a good design model even though it does not legally apply: secure, computer-generated, time-stamped audit trails that never hide prior values, and signature manifests showing printed name, date/time and meaning. Joint Commission historically accepted computer "signatures" for authentication, but I found no current TJC statement specific to EC/LS records. Photos need server-side timestamps and hashing, because EXIF metadata is not trustworthy. HIPAA mainly means building ways to avoid capturing patients and PHI.

### Cited Findings
**E-signature law (ESIGN / UETA)**
- The core requirements are intent to sign, consent to do business electronically, association of the signature with the record, and retention with accurate reproduction. — [Paperform ESIGN/UETA](https://paperform.co/blog/euta-esign-act-requirements); [Adobe ESIGN](https://www.adobe.com/sign/hub/how-to/what-is-the-e-sign-act.html)
- Between businesses, consent to transact electronically can be explicit or implied from how the parties deal with each other. Consumers get stricter disclosure and consent rules. — [Arvato/DocuSign legal whitepaper](https://us.arvato-systems.com/resource/blob/18248/1679f579e329326a73a3a4bc57df2bf1/arvato-systems-esigning-docusign-legal-whitepaper-ueta-esign-en-data.pdf)
- The capture system must either keep a record of how the signature was made or attach a textual or graphic statement that it was executed electronically. — [Arvato/DocuSign whitepaper](https://us.arvato-systems.com/resource/blob/18248/1679f579e329326a73a3a4bc57df2bf1/arvato-systems-esigning-docusign-legal-whitepaper-ueta-esign-en-data.pdf)
- Retained records must reproduce the original accurately and meet any retention periods set by other laws. — [Adobe ESIGN](https://www.adobe.com/sign/hub/how-to/what-is-the-e-sign-act.html)
- UETA is adopted in 49 states, all except New York, which has its own Electronic Signatures and Records Act. Sources differ slightly on the phrasing. — [Ironclad e-signature law](https://ironcladapp.com/journal/contract-management/electronic-signature-law); [DocuSign state laws](https://www.docusign.com/learn/electronic-signature-laws-state)

**21 CFR Part 11 as a reference model (it applies to FDA-regulated records, not construction)**
- §11.10(e) requires secure, computer-generated, time-stamped audit trails. They must independently record the date and time of operator entries and actions that create, modify or delete records, and changes must not obscure earlier values. Audit trails are kept at least as long as the record. — [Ofni Systems 11.10(e)](https://www.ofnisystems.com/21-cfr-11-10e-audit-trails/); [SimplerQMS](https://simplerqms.com/21-cfr-part-11-audit-trail/)
- A signed record must show the signer's printed name, the date and time of signing, and the meaning of the signature (for example "reviewed" or "approved"). — [Klyverity Part 11 audit trail](https://klyverity.com/blog/part-11-audit-trail-requirements)
- Implementation guidance (vendor, not regulation): use server-generated timestamps synced to an external time standard. No user, including admins, should be able to modify the audit trail, and one source argues access controls alone don't stop a DBA from altering history, so cryptographic or append-only techniques are needed. — [Brightinfonet](https://www.brightinfonet.com/insights/21-cfr-part-11-audit-trail-requirements); [Klyverity](https://klyverity.com/blog/part-11-audit-trail-requirements)

**Joint Commission / CMS**
- A 1999 article on TJC's former IM.7.8 (medical records) says entries must be dated, attributed to the author and authenticated, and that authentication may be by signature, initials, rubber stamp, or computer "signature" (key sequence). This is old and about medical records, not EC. — [Clinician.com TJC e-signature standard](https://www.clinician.com/articles/43688-joint-commission-standard-on-electronic-signatures)
- TJC's "Hospital Life Safety & Environment of Care Document List and Review Tool" says surveyors may ask for other EC and LS documents as needed during the survey. TJC also runs virtual document reviews, which favors documentation that is organized and easy to retrieve digitally. — [TJC LS/EC document list](https://digitalassets.jointcommission.org/api/public/content/29635f929b954b6c93beed7ed2a7816b?v=8ca3c82b); [Greeley virtual document review](https://www.greeley.com/insights/rise-virtual-surveys-watch-out-joint-commissions-virtual-document-review)
- TJC changed its accreditation model on Jan 1, 2026 ("Accreditation 360," with optional Continuous Engagement), and more than 700 standards are being removed from the hospital framework. — [McDermott 2026 updates](https://www.mcdermottlaw.com/insights/joint-commission-announces-key-accreditation-updates-for-2026/); [TJC News July 2026](https://www.jointcommission.org/en-us/knowledge-library/newsletters/jc-news/july-2026)
- Veoci markets EOC records organized for TJC, CMS and DNV audits, which signals the market expects digital records to be accepted. This is vendor evidence only. — [Veoci](https://veoci.com/hospitals-healthcare/eoc-rounding)

**Photo and timestamp trustworthiness**
- EXIF metadata (camera, time, GPS) has no cryptographic binding and can be edited without a trace. — [metadata-editor C2PA guide](https://metadata-editor.com/guides/what-is-c2pa-content-credentials); [Fotoware C2PA](https://www.fotoware.com/blog/what-is-c2pa)
- C2PA Content Credentials use SHA-256 hashes, X.509 certificates and digital signatures. The manifest hashes both the asset and its provenance, so edits break the link, and EXIF/XMP can be wrapped as signed assertions. Trust depends on a certificate chain the validator accepts, and self-signed manifests show as "valid but untrusted." — [C2PA FAQ](https://c2pa.org/faqs/); [SoftwareSeni C2PA limits](https://www.softwareseni.com/how-c2pa-content-credentials-work-and-what-their-limits-are/)
- C2PA limits: it is tamper-evident, not tamper-proof. It cannot prove a scene is real (for example, a photo of a screen). An academic review says the specs make only claim-integrity and weak file-integrity guarantees. — [arXiv 2604.24890](https://arxiv.org/pdf/2604.24890); [SoftwareSeni](https://www.softwareseni.com/how-c2pa-content-credentials-work-and-what-their-limits-are/)
- Wikipedia reports an October 2026 demonstration of altering an image without invalidating C2PA signatures or trusted timestamps. This is single-source and unverified. — [Wikipedia Content Credentials](https://en.wikipedia.org/wiki/Content_Credentials)
- Construction firestop tools already use "time-stamped photos" and installer declarations as evidence (Onetrace, per search summary), and inspection reports are expected to include before and after photos. — [Emergent firestop inspection](https://www.emergent.tech/blog/firestop-inspection)

**HIPAA and photos in hospitals**
- HIPAA identifiers include "full face photographic images and any comparable images." Tattoos, name badges, whiteboards, wristbands, monitors and mirror reflections in the background can also identify patients. — [HIPAA Journal photography rules](https://www.hipaajournal.com/hipaa-photography-rules/); [AccountableHQ HIPAA photography](https://www.accountablehq.com/post/hipaa-and-photography)
- Recommended safeguards: cover whiteboards, name bands and charts; turn away monitors; avoid capturing screens, labels or other patients. Hospital policies set who may photograph, approved devices and apps, required authorizations, and where images are stored. — [AccountableHQ NICU guidance](https://www.accountablehq.com/post/hipaa-training-for-nicu-nurses-safely-posting-newborn-photos-to-parent-portals-from-personal-phones); [UAMS patient photography policy](https://hipaa.uams.edu/wp-content/uploads/sites/62/2023/04/2-1-26-Patient-Photography-2022.pdf)
- Unauthorized disclosure of identifiable information in photos can violate state privacy laws even where HIPAA does not apply directly. — [HIPAA Journal](https://www.hipaajournal.com/hipaa-photography-rules/)

### Inferences
Design implications for the startup:
- **Signatures:** Capture an explicit intent action (for example "I attest this item is compliant"). Store a signature manifest with printed name, role, UTC server time, device time and meaning ("performed," "verified," "co-signed," "rework requested"), and render it on the PDF. Get B2B consent to e-records in the terms of service or project onboarding. These steps map onto ESIGN/UETA plus Part 11 §11.50.
- **Audit trail:** Use an append-only event log, where checking, unchecking, rework and edits each create a new event and nothing is overwritten. Hash-chain the events (each event includes the previous event's hash), and periodically anchor the chain to an external timestamp, for example RFC 3161 (not researched here). Admin edits should be impossible or themselves logged. The planned "any user can uncheck a non-compliant item (logged)" fits this model as long as the uncheck is a new event, not a deletion.
- **Timestamps:** Record both device capture time (for offline work) and server receipt time. Flag large gaps. Treat server time as authoritative and device time as a claim.
- **Photos:** Compute a SHA-256 hash on the device at capture and store the original next to any annotated copy. Optionally sign it C2PA-style. Do not rely on EXIF or GPS alone, and strip GPS/EXIF from exported or shared copies where hospital policy requires it.
- **HIPAA:** Show a capture-time privacy prompt, offer face and whiteboard blur, keep photos in the app sandbox rather than the camera roll, encrypt at rest, use role-based access, and expect to sign BAAs or follow hospital vendor and photography policies. Contractors photographing in occupied units need this.

### Gaps
- I found no current, authoritative Joint Commission or CMS statement that explicitly addresses electronic signatures or electronic records for EC/LS/ILSM/ICRA documentation. Primary sources to check: the TJC E-dition, TJC Standards Interpretation FAQs, and the CMS State Operations Manual Appendix A/Z.
- Record retention: I found no authoritative retention period for ICRA permits or ILSM documentation (TJC lookback, CMS, or state requirements). Hospital-policy and contract retention, and statutes of repose for construction defects, likely govern. This needs a separate check.
- I did not research RFC 3161 time-stamp authorities or the legal admissibility of hashed or hash-chained records (FRE 902(13)/(14) self-authentication of electronic records would be a useful follow-up).
- Whether a contractor photographing in a hospital is a HIPAA business associate depends on the contract. I found no authoritative source specific to construction contractors.

## 5. Market sizing signals

### Takeaway
There are about 6,100 US hospitals (AHA 2026), and roughly 4,000+ are Joint Commission accredited (an older figure). Healthcare construction runs about $50–77B a year (Census, units vary by release and series), and sources disagree on whether 2026 is up or down. That is a large, steady base of ICRA/ILSM-regulated projects, while the buyer pool of healthcare-specialist GCs and subs is far smaller.

### Cited Findings
- AHA Fast Facts 2026: 6,100 US hospitals (5,121 community, 656 nonfederal psychiatric, 210 federal, 113 other), based on the 2024 AHA Annual Survey. The 2025 edition reported 6,093. — [AHA Fast Facts 2026](https://www.aha.org/statistics/fast-facts-us-hospitals-2017); [AHA 2026 infographic](https://www.aha.org/system/files/media/file/2026/02/Fast-Facts-on-US-Hospitals-2026-Infographics.pdf)
- Joint Commission: "approximately 4,023" general, pediatric, LTAC, psychiatric, rehab and specialty hospitals plus 366 critical access hospitals, which is about 77% of US hospitals. This is a dated figure (about 5 years old) quoted by a secondary blog. TJC's own page says only "thousands." — [CHT Healthcare accreditation facts](https://www.chthealthcare.com/blog/hospital-accreditation); [TJC Hospital Accreditation](https://www.jointcommission.org/en-us/accreditation/hospital)
- Census, August 2026 release (published Oct 1, 2026): total construction was $2,203.1B SAAR, up 0.9% from July and down 1.7% year over year. Private nonresidential was $773.0B. — [Census August 2026 release](https://www.census.gov/construction/c30/pdf/release.pdf); [NAHB Eye on Housing](https://eyeonhousing.org/2026/10/private-residential-construction-spending-posts-broad-based-gains-in-august/)
- Census health care, August 2026 release: a search summary of the table reads year-to-date 2026 health care spending at about $49.6B (down 2.5% from the same period in 2025), with private health care YTD about $37.4B (down 5.2%). The column headers could not be read cleanly, so treat these as approximate. — [Census August 2026 release](https://www.census.gov/construction/c30/pdf/release.pdf)
- Census, May 2026 release: the health care lines read $76,820M and $59,334M SAAR, likely total and private respectively, but this is not confirmed. FRED's private health care series shows about $74.5B (May 2026; units unclear). — [Census May 2026](https://www.census.gov/construction/c30/pdf/pr202605.pdf); [FRED MPCV04XXS](https://fred.stlouisfed.org/series/MPCV04XXS)
- Forecasts conflict:
  - FMI (as reported second-hand by Buildermuse): $52B healthcare construction in Q1 2026, up 14.2% year over year.
  - AIA Consensus Forecast: healthcare spending up 2.6% in 2026 and 4.4% in 2027.
  - ConstructConnect (via HFMA): hospital and clinic starts up 11.6% in 2026 to $30.7B. A different ConstructConnect vintage shows $28.4B for 2026.
  - HFMA: hospital construction projected at $38.8B by 2030. An ASHE survey found 19% of respondents planned a new acute care hospital within 3 years.
  — [Buildermuse](https://buildermuse.com/commercial/healthcare-construction-spending-reaches-52-billion-/); [MCD Mag AIA](https://mcdmag.com/2026/02/aia-healthcare-spending-to-see-growth-through-2027/); [HFMA forecast](https://www.hfma.org/fast-finance/hospital-construction-spending-forecast-2030/); [ConstructConnect](https://news.constructconnect.com/hospital-construction-booms-forecasts-point-to-sustained-growth)

### Inferences
- Every one of the roughly 6,100 hospitals runs renovation, infrastructure and maintenance projects continuously, and each one needs an ICRA (and often PCRA/ILSM) when it affects patient areas. Project count is driven more by renovation churn than by new-build dollars, so the market is less cyclical than headline spending suggests.
- Census YTD data (down) conflicts with the FMI, AIA and ConstructConnect forecasts (up). The safest pitch frames healthcare construction as roughly a $50–75B-a-year steady sector, not a boom.

### Gaps
- I could not obtain the exact August 2026 Census health care SAAR line (the census.gov PDF fetch failed).
- No reliable source found for the number of ICRA permits or healthcare construction projects per year, the number of healthcare-specialist GCs and subs, or average projects per hospital per year. ASHE or FGI surveys and Dodge project-start counts would be the next sources.
- No current (2026) official count of TJC-accredited hospitals found.
- Dodge Data & Analytics healthcare start figures were not retrieved.
