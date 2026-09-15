/**
 * MEDIORACLE — public landing page.
 * Visual system cloned from the neuconomi genre:
 * ivory top bar · red logotype · caps nav · red/black split hero with
 * ecosystem diagram · caps section heads with red underline · countdown
 * numbers · link-card groups · chip grids · numbered benefits · big footer.
 *
 * The app itself (sign-in, dashboard, features) is NEVER shown here —
 * visitors must click Sign in / Get started.
 */
import { Link } from 'react-router-dom';
import {
  Building2, CircleDollarSign, ClipboardCheck, Clock3, HeartPulse, Hospital,
  Home, BriefcaseMedical, MessageCircle, Sparkles, Stethoscope, Syringe,
  ShieldCheck, Siren, Users, Baby, Pill, Activity,
} from 'lucide-react';
import { specialties } from '../lib/data';

/* ---------------- data ---------------- */

const stats: [string, string, string][] = [
  ['13', 'Workforce', 'Modules'],
  ['18', 'Clinical', 'Specialties'],
  ['24/7', 'Shift', 'Coverage'],
  ['100%', 'Auditable', 'History'],
  ['05', 'Professional', 'Roles'],
  ['03', 'Stakeholder', 'Types'],
  ['02', 'Sides, One', 'Marketplace'],
  ['01', 'Unified', 'Platform'],
];

const facilitiesLinks = [
  ['Enterprise', 'Facilities'], ['Clinics', ''], ['Nursing', 'Homes'],
  ['Diagnostic', 'Centers'], ['Staffing', 'Agencies'],
];
const professionalsLinks = [
  ['Registered', 'Nurses'], ['Healthcare', 'Assistants'], ['Midwives', ''],
  ['Pharmacists', ''], ['Allied', 'Health'],
];

const solutions = [
  { icon: BriefcaseMedical, name: 'Shifts Management', desc: 'Posting open shifts, filling critical gaps and tracking every role from open to paid.' },
  { icon: Sparkles, name: 'AI Candidate Matching', desc: 'Deterministic matching that scores professionals on credentials, distance and reliability.' },
  { icon: ShieldCheck, name: 'Compliance', desc: 'License and certificate tracking with expiry watch, before it becomes a risk.' },
  { icon: ClipboardCheck, name: 'Timesheets', desc: 'Digital approval of worked hours with a complete, auditable trail.' },
  { icon: CircleDollarSign, name: 'Billing & Payments', desc: 'Invoice facilities, pay professionals — one flow, zero spreadsheets.' },
  { icon: Activity, name: 'Analytics', desc: 'Fill rate, coverage and cost metrics your leadership actually reads.' },
];

const departments = [
  'Intensive Care', 'Emergency', 'Maternity', 'General Medicine', 'Surgery',
  'Oncology', 'Pediatrics', 'Cardiology', 'Radiology', 'Pharmacy',
];
const useCases = [
  'Night Shifts', 'Long-term Cover', 'Rapid Response', 'Seasonal Peaks',
  'Leave Fill-in', 'Temp-to-Perm', 'Agency Bench', 'Compliance Audits',
];

const benefits = [
  'Fill critical shifts in hours, not days', 'Keep every ward safely staffed',
  'Verify credentials before the shift', 'One audit trail from posting to payment',
  'Stop compliance surprises', 'Approve timesheets digitally',
  'Invoice facilities without spreadsheets', 'Pay professionals on time, every time',
  'Collaborate with agencies in one place', 'See workforce demand before it bites',
  'Scale from one ward to a whole group', 'Give professionals their time back',
];

const quotes = [
  { q: 'Night shifts in ICU used to take three phone trees to fill. Now verified names are proposed before I finish my coffee.', who: 'Facility Manager', org: 'Urban Hospital' },
  { q: 'Compliance used to live in a binder. Now expiry dates find me before auditors do.', who: 'Compliance Officer', org: 'Clinic Group' },
  { q: 'I get matched to shifts near me, my timesheet approves itself, and I get paid on time.', who: 'Registered Nurse', org: 'Platform Professional' },
  { q: 'We realized the full potential of our agency bench across five facilities.', who: 'Agency Director', org: 'Staffing Agency' },
];

/* ---------------- page ---------------- */

export default function Landing() {
  return (
    <>
      {/* ================= TOP BAR ================= */}
      <header className="neoTopbar">
        <div className="neoTopbarInner">
          <Link to="/" className="neoLogo" aria-label="MediOracle home">
            <span className="neoLogoOver">MEDI</span>ORACLE
          </Link>
          <nav className="neoNav">
            <a href="#who" className="on">Platform</a>
            <a href="#solutions">Solutions</a>
            <a href="#how">Facilities</a>
            <a href="#how">Professionals</a>
            <a href="#numbers">Numbers</a>
            <a href="#company">Company</a>
          </nav>
          <div className="neoTopActions">
            <Link to="/signin" className="neoBtnLine">Sign in</Link>
            <Link to="/signup" className="neoBtnRed">Get started</Link>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="neoHero">
        <div className="neoHeroInner">
          <div className="neoHeroCopy">
            <h1>
              <span className="neoHeroRed">Healthcare Staffing</span>
              <span className="neoHeroDark">Orchestrated.</span>
            </h1>
            <p className="neoHeroTag">One platform for facilities, professionals and agencies.</p>
            <div className="neoHeroCtas">
              <Link to="/signup" className="neoBtnRed">Schedule a discussion</Link>
              <Link to="/signin" className="neoBtnLine">Sign in</Link>
            </div>
          </div>

          {/* ecosystem diagram — the signature element */}
          <div className="diagram" aria-hidden="true">
            <div className="dBox">
              <div className="dBoxHead">Professionals <small>(Nurses · Allied Health)</small></div>
              <div className="dItems">
                <div className="dItem"><Stethoscope /><span>Registered Nurses</span></div>
                <div className="dItem"><Syringe /><span>Healthcare Assistants</span></div>
                <div className="dItem"><Baby /><span>Midwives</span></div>
                <div className="dItem"><Pill /><span>Pharmacists</span></div>
                <div className="dItem"><HeartPulse /><span>Allied Health</span></div>
              </div>
            </div>

            <div className="dMiddle">
              <div className="dBox slim redBox">
                <div className="dBoxHead">Agencies</div>
                <div className="dItems one"><div className="dItem"><Users /><span>Staffing Agencies</span></div></div>
              </div>
              <div className="dArrowsH">⟷</div>
              <div className="dCenter"><span>MEDI<br />ORACLE</span></div>
              <div className="dArrowsH">⟷</div>
              <div className="dBox slim redBox">
                <div className="dBoxHead">Insurers</div>
                <div className="dItems one"><div className="dItem"><ShieldCheck /><span>Insurance Providers</span></div></div>
              </div>
            </div>

            <div className="dBox">
              <div className="dBoxHead">Facilities <small>(Hospitals · Clinics)</small></div>
              <div className="dItems">
                <div className="dItem"><Hospital /><span>Enterprise Hospitals</span></div>
                <div className="dItem"><Building2 /><span>Community Hospitals</span></div>
                <div className="dItem"><Siren /><span>Emergency Clinics</span></div>
                <div className="dItem"><Home /><span>Nursing Homes</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHO WE ARE ================= */}
      <section className="neoSection" id="who">
        <h2 className="neoSecHead">Who We Are?</h2>
        <p className="neoStatement">
          The Operating System for<br />
          <em>Healthcare Workforce</em>
        </p>
        <p className="neoBody">
          <b className="neoRed">MEDIORACLE</b> is a new-age healthcare workforce platform,
          built for fueling safe staffing — from the first open shift to the final payment.
        </p>
        <p className="neoBody">
          We bring together verified professionals and the facilities who need them,
          and orchestrate staffing, compliance and workforce finance in one place.
        </p>
      </section>

      {/* ================= WHAT WE DO ================= */}
      <section className="neoSection alt" id="what">
        <h2 className="neoSecHead">What We Do?</h2>
        <p className="neoBody wide">
          We partner with <b>Facilities</b> (Hospitals, Clinics, Nursing Homes) and{' '}
          <b>Professionals</b> (Nurses, Allied Health) to keep every ward safely staffed
          through our platform — matching, compliance, scheduling, timesheets and payments,
          end to end.
        </p>
      </section>

      {/* ================= BY NUMBERS ================= */}
      <section className="neoSection" id="numbers">
        <h2 className="neoSecHead">MediOracle by Numbers</h2>
        <div className="neoNums">
          {stats.map(([n, l1, l2]) => (
            <div className="neoNum" key={l1 + l2}>
              <b>{n}</b>
              <span>{l1}<br />{l2}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW WE DO ================= */}
      <section className="neoSection alt" id="how">
        <h2 className="neoSecHead">How We Do?</h2>
        <div className="neoHow">
          <div className="neoHowCol">
            <h3>Facilities</h3>
            <p className="neoHowSub">Post shifts. Fill gaps. Pay with confidence.</p>
            {facilitiesLinks.map(([a, b]) => (
              <Link to="/signup" className="neoHowLink" key={a}>
                <b>{a}</b>{b && <><br />{b}</>}
              </Link>
            ))}
          </div>
          <div className="neoHowCol">
            <h3>Professionals</h3>
            <p className="neoHowSub">Get matched. Work your specialty. Get paid.</p>
            {professionalsLinks.map(([a, b]) => (
              <Link to="/signup" className="neoHowLink" key={a}>
                <b>{a}</b>{b && <><br />{b}</>}
              </Link>
            ))}
          </div>
          <div className="neoHowCol">
            <h3>Agencies & Insurers</h3>
            <p className="neoHowSub">Run contracts, compliance and risk in one console.</p>
            <Link to="/signup" className="neoHowLink"><b>Staffing</b><br />Agencies</Link>
            <Link to="/signup" className="neoHowLink"><b>Insurance</b><br />Providers</Link>
            <Link to="/signup" className="neoHowLink"><b>Auditors &</b><br />Consultants</Link>
          </div>
        </div>
      </section>

      {/* ================= SOLUTIONS ================= */}
      <section className="neoSection" id="solutions">
        <h2 className="neoSecHead">Solutions Offered</h2>
        <p className="neoBody">We offer following solutions</p>
        <div className="neoSols">
          {solutions.map((s) => (
            <div className="neoSol" key={s.name}>
              <div className="neoSolIcon"><s.icon /></div>
              <h3>{s.name}</h3>
              <p>{s.desc}</p>
              <Link to="/signup" className="neoKnow">Know More →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SPECIALTIES ================= */}
      <section className="neoSection alt">
        <h2 className="neoSecHead">Clinical Specialties</h2>
        <p className="neoBody">
          Spanning across <b>18 clinical specialties</b> — our matching understands the
          difference between an ICU nurse and a ward nurse, automatically.
        </p>
        <div className="neoChips">
          {specialties.map((s) => <span className="neoChip" key={s}>{s}</span>)}
        </div>
      </section>

      {/* ================= DEPARTMENTS & USE CASES ================= */}
      <section className="neoSection">
        <h2 className="neoSecHead">Departments & Use Cases</h2>
        <div className="neoTwoChips">
          <div>
            <h3>Departments</h3>
            <div className="neoChips left">{departments.map((d) => <span className="neoChip" key={d}>{d}</span>)}</div>
          </div>
          <div>
            <h3>Potential Use Cases</h3>
            <div className="neoChips left">{useCases.map((u) => <span className="neoChip" key={u}>{u}</span>)}</div>
          </div>
        </div>
      </section>

      {/* ================= BENEFITS ================= */}
      <section className="neoSection alt">
        <h2 className="neoSecHead">Benefits of MediOracle</h2>
        <div className="neoBens">
          {benefits.map((b, i) => (
            <div className="neoBen" key={b}>
              <b>{String(i + 1).padStart(2, '0')}.</b> {b}
            </div>
          ))}
        </div>
      </section>

      {/* ================= GET STARTED ================= */}
      <section className="neoSection" id="company">
        <h2 className="neoSecHead">Get Started</h2>
        <p className="neoBody">Get in touch with us to learn more. Our expert <b>will</b> call you right away.</p>
        <div className="neoCtas">
          <Link to="/signup" className="neoBtnRed">Schedule a discussion</Link>
          <Link to="/signup" className="neoBtnLine">Request Pricing</Link>
        </div>
        <p className="neoSignInLine">
          Already have an account? <Link to="/signin" className="neoRed">Sign in</Link>
        </p>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="neoSection alt">
        <h2 className="neoSecHead">Testimonials</h2>
        <p className="neoBody">Our customers love what we do</p>
        <div className="neoQuotes">
          {quotes.map((t) => (
            <figure className="neoQuote" key={t.who}>
              <p>“{t.q}”</p>
              <footer><b>{t.who}</b><span>{t.org}</span></footer>
            </figure>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="neoFooter">
        <div className="neoFooterInner">
          <div className="neoFootBrand">
            <div className="neoLogo"><span className="neoLogoOver">MEDI</span>ORACLE</div>
            <p>
              MEDIORACLE is a healthcare workforce platform. It focuses on safe staffing,
              compliance and workforce finance — and takes healthcare operations to the next level.
            </p>
          </div>
          <div className="neoFootCol">
            <h4>PLATFORM</h4>
            <Link to="/signup">Facilities</Link>
            <Link to="/signup">Professionals</Link>
            <Link to="/signup">Agencies</Link>
            <Link to="/signup">Insurers</Link>
          </div>
          <div className="neoFootCol">
            <h4>MODULES</h4>
            <a href="#solutions">Shifts Management</a>
            <a href="#solutions">Candidate Matching</a>
            <a href="#solutions">Compliance</a>
            <a href="#solutions">Timesheets</a>
            <a href="#solutions">Billing & Payments</a>
            <a href="#solutions">Analytics</a>
          </div>
          <div className="neoFootCol">
            <h4>COMPANY</h4>
            <a href="#who">About MediOracle</a>
            <a href="#numbers">By Numbers</a>
            <a href="#company">Contact Us</a>
            <Link to="/signin">Sign in</Link>
          </div>
        </div>
        <div className="neoFootBase">
          <span>Copyright © 2026, MediOracle. All rights reserved.</span>
          <span>All other logos are Trademarks or Registered Trademarks of their respective owners.</span>
          <span>Developed by Varshith Reddy</span>
        </div>
      </footer>

      {/* decorative chat bubble */}
      <div className="chatFab" aria-hidden="true"><MessageCircle /></div>
    </>
  );
}
