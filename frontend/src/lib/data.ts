/* Shared demo data for the workspace — one place, reused by every page. */
import { Activity, BarChart3, BriefcaseMedical, CalendarDays, CircleDollarSign, ClipboardCheck, Clock3, Headphones, LayoutDashboard, Plug, ShieldCheck, Users } from 'lucide-react';

export const shifts = [
  { id: 'MS-2048', role: 'Registered Nurse', ward: 'ICU · Ward 3', date: 'Today, 19:00–07:00', gap: 2, filled: 4, status: 'Critical', rate: '€32.50/hr' },
  { id: 'MS-2049', role: 'Healthcare Assistant', ward: 'Emergency · Floor 1', date: 'Today, 14:00–22:00', gap: 1, filled: 5, status: 'At risk', rate: '€19.80/hr' },
  { id: 'MS-2051', role: 'Midwife', ward: 'Maternity · Ward 5', date: 'Tomorrow, 07:00–19:00', gap: 0, filled: 3, status: 'Staffed', rate: '€35.00/hr' },
  { id: 'MS-2053', role: 'Pharmacist', ward: 'Pharmacy', date: 'Tomorrow, 09:00–17:00', gap: 1, filled: 1, status: 'Open', rate: '€38.00/hr' },
];

export const candidates = [
  { name: 'Olivia Murphy', role: 'Registered Nurse · ICU', score: 94, confidence: 96, distance: '4.2 km', rating: '4.9', factors: ['All credentials verified', 'ICU specialty matched', 'Previous facility experience'] },
  { name: 'Ava O’Connor', role: 'Registered Nurse · Critical Care', score: 89, confidence: 92, distance: '7.8 km', rating: '4.8', factors: ['Available full shift', 'Low commute', 'Strong reliability'] },
  { name: 'Sarah Byrne', role: 'Registered Nurse', score: 83, confidence: 88, distance: '12 km', rating: '4.7', factors: ['Skills matched', 'Working-time compliant', 'Preferred facility'] },
];

export const wards = [
  ['Emergency', 28, 30], ['Intensive care', 16, 20],
  ['Maternity', 22, 22], ['General medicine', 36, 40],
] as const;

export const timesheets = [
  { id: 'TS-139', who: 'Olivia Murphy', shift: 'ICU · Night', hours: '11.5h', status: 'Approved' },
  { id: 'TS-138', who: 'Ava O’Connor', shift: 'Emergency · Evening', hours: '8h', status: 'Pending' },
  { id: 'TS-137', who: 'Sarah Byrne', shift: 'General · Day', hours: '7.5h', status: 'Pending' },
  { id: 'TS-136', who: 'Noah Fischer', shift: 'Maternity · Day', hours: '12h', status: 'Disputed' },
];

export const invoices = [
  { id: 'INV-1047', client: 'AVT Hospitals — Ward 3', amount: '€12,480.00', due: 'Sep 30', status: 'Open' },
  { id: 'INV-1046', client: 'AVT Hospitals — Emergency', amount: '€8,920.00', due: 'Sep 24', status: 'Paid' },
  { id: 'INV-1045', client: 'AVT Hospitals — Maternity', amount: '€6,150.00', due: 'Sep 18', status: 'Overdue' },
];

export const payments = [
  { id: 'PAY-881', to: 'Olivia Murphy', for: 'TS-139 · ICU night', amount: '€373.75', status: 'Processed' },
  { id: 'PAY-880', to: 'Ava O’Connor', for: 'TS-138 · Emergency', amount: '€158.40', status: 'Queued' },
  { id: 'PAY-879', to: 'Sarah Byrne', for: 'TS-137 · General', amount: '€146.25', status: 'Queued' },
];

export const professionals = [
  { name: 'Olivia Murphy', role: 'Registered Nurse', specialty: 'ICU', rating: '4.9', status: 'Available' },
  { name: 'Ava O’Connor', role: 'Registered Nurse', specialty: 'Critical Care', rating: '4.8', status: 'On shift' },
  { name: 'Sarah Byrne', role: 'Registered Nurse', specialty: 'General', rating: '4.7', status: 'Available' },
  { name: 'Noah Fischer', role: 'Healthcare Assistant', specialty: 'Emergency', rating: '4.6', status: 'Available' },
  { name: 'Priya Nair', role: 'Pharmacist', specialty: 'Pharmacy', rating: '4.9', status: 'On shift' },
];

export const complianceItems = [
  { who: 'Olivia Murphy', item: 'ICU certificate', expires: 'Mar 2027', status: 'Valid' },
  { who: 'Ava O’Connor', item: 'BLS certification', expires: 'Oct 2026', status: 'Expiring' },
  { who: 'Noah Fischer', item: 'Background check', expires: 'Sep 2026', status: 'Expiring' },
  { who: 'Priya Nair', item: 'Pharmacy license', expires: 'Aug 2026', status: 'Expired' },
  { who: 'Sarah Byrne', item: 'Immunization record', expires: 'Jan 2027', status: 'Valid' },
];

export const integrations = [
  { name: 'HR system', desc: 'Sync staff records and contracts', status: 'Connected' },
  { name: 'Payroll', desc: 'Push approved timesheets to payroll', status: 'Connected' },
  { name: 'Credential registry', desc: 'Auto-verify licenses and certificates', status: 'Available' },
  { name: 'Billing / ERP', desc: 'Export invoices to your finance stack', status: 'Available' },
];

export const analyticsRows = [
  ['Fill rate', 91, '%'], ['Coverage', 87, '%'], ['Compliance', 96, '%'],
  ['Shift fulfilment speed', 78, '%'], ['Timesheet accuracy', 99, '%'],
] as const;

/* landing content */
export const specialties = [
  'Intensive Care', 'Emergency', 'Maternity', 'General Medicine', 'Surgery', 'Pediatrics',
  'Cardiology', 'Oncology', 'Radiology', 'Pharmacy', 'Anesthesiology', 'Orthopedics',
  'Neurology', 'Geriatrics', 'Home Care', 'Mental Health', 'Rehabilitation', 'Dialysis',
];

/* dashboard feature hub — the ONLY navigation in the app */
export const features = [
  { path: '/dashboard', name: 'Overview', desc: 'Coverage, KPIs and alerts', icon: LayoutDashboard },
  { path: '/floor-staffing', name: 'Floor staffing', desc: 'Ward-by-ward coverage', icon: Activity },
  { path: '/shifts', name: 'Shifts', desc: 'Post, fill and track shifts', icon: BriefcaseMedical },
  { path: '/schedule', name: 'Schedule', desc: 'The week at a glance', icon: CalendarDays },
  { path: '/candidates', name: 'Candidates', desc: 'AI-matched professionals', icon: Users },
  { path: '/compliance', name: 'Compliance', desc: 'Credentials and expiry watch', icon: ShieldCheck },
  { path: '/timesheets', name: 'Timesheets', desc: 'Approve worked hours', icon: Clock3 },
  { path: '/billing', name: 'Billing', desc: 'Invoices and receivables', icon: CircleDollarSign },
  { path: '/payments', name: 'Payments', desc: 'Pay your professionals', icon: CircleDollarSign },
  { path: '/integrations', name: 'Integrations', desc: 'Connect your systems', icon: Plug },
  { path: '/professional', name: 'Professionals', desc: 'Your talent directory', icon: Users },
  { path: '/analytics', name: 'Analytics', desc: 'Performance metrics', icon: BarChart3 },
  { path: '/support', name: 'Support', desc: 'Help and contact', icon: Headphones },
];

/* per-hospital fake-but-deterministic KPIs so each hospital feels personal */
export function kpisFor(hospital: string) {
  let h = 0;
  for (const c of hospital) h = (h * 31 + c.charCodeAt(0)) % 997;
  return {
    coverage: 82 + (h % 12),
    openShifts: 4 + (h % 7),
    fillRate: 85 + (h % 10),
    timeToFill: 18 + (h % 9),
  };
}
export { ClipboardCheck };
