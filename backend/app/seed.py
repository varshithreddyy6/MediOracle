"""Per-hospital seed data — every new hospital gets its own isolated
operational dataset, personalized with the hospital's name."""
from . import db

def seed_hospital(hospital_id: int, hospital_name: str):
    rows = [
        # wards
        ("INSERT INTO wards (hospital_id,name,filled,required) VALUES (?,?,?,?)",
         [(hospital_id, "Emergency", 28, 30), (hospital_id, "Intensive care", 16, 20),
          (hospital_id, "Maternity", 22, 22), (hospital_id, "General medicine", 36, 40)]),
        # shifts
        ("INSERT INTO shifts (hospital_id,ref,role,ward,when_text,gap,filled,status,rate) VALUES (?,?,?,?,?,?,?,?,?)",
         [(hospital_id, "MS-2048", "Registered Nurse", "ICU · Ward 3", "Today, 19:00–07:00", 2, 4, "Critical", "€32.50/hr"),
          (hospital_id, "MS-2049", "Healthcare Assistant", "Emergency · Floor 1", "Today, 14:00–22:00", 1, 5, "At risk", "€19.80/hr"),
          (hospital_id, "MS-2051", "Midwife", "Maternity · Ward 5", "Tomorrow, 07:00–19:00", 0, 3, "Staffed", "€35.00/hr"),
          (hospital_id, "MS-2053", "Pharmacist", "Pharmacy", "Tomorrow, 09:00–17:00", 1, 1, "Open", "€38.00/hr")]),
        # candidates
        ("INSERT INTO candidates (hospital_id,name,role,score,confidence,distance,rating,factors) VALUES (?,?,?,?,?,?,?,?)",
         [(hospital_id, "Olivia Murphy", "Registered Nurse · ICU", 94, 96, "4.2 km", "4.9",
           "All credentials verified|ICU specialty matched|Previous facility experience"),
          (hospital_id, "Ava O’Connor", "Registered Nurse · Critical Care", 89, 92, "7.8 km", "4.8",
           "Available full shift|Low commute|Strong reliability"),
          (hospital_id, "Sarah Byrne", "Registered Nurse", 83, 88, "12 km", "4.7",
           "Skills matched|Working-time compliant|Preferred facility")]),
        # timesheets
        ("INSERT INTO timesheets (hospital_id,ref,who,shift,hours,status) VALUES (?,?,?,?,?,?)",
         [(hospital_id, "TS-139", "Olivia Murphy", "ICU · Night", "11.5h", "Approved"),
          (hospital_id, "TS-138", "Ava O’Connor", "Emergency · Evening", "8h", "Pending"),
          (hospital_id, "TS-137", "Sarah Byrne", "General · Day", "7.5h", "Pending"),
          (hospital_id, "TS-136", "Noah Fischer", "Maternity · Day", "12h", "Disputed")]),
        # invoices — personalized with the hospital name
        ("INSERT INTO invoices (hospital_id,ref,client,amount,due,status) VALUES (?,?,?,?,?,?)",
         [(hospital_id, "INV-1047", f"{hospital_name} — Ward 3", "€12,480.00", "Sep 30", "Open"),
          (hospital_id, "INV-1046", f"{hospital_name} — Emergency", "€8,920.00", "Sep 24", "Paid"),
          (hospital_id, "INV-1045", f"{hospital_name} — Maternity", "€6,150.00", "Sep 18", "Overdue")]),
        # payments
        ("INSERT INTO payments (hospital_id,ref,to_who,for_what,amount,status) VALUES (?,?,?,?,?,?)",
         [(hospital_id, "PAY-881", "Olivia Murphy", "TS-139 · ICU night", "€373.75", "Processed"),
          (hospital_id, "PAY-880", "Ava O’Connor", "TS-138 · Emergency", "€158.40", "Queued"),
          (hospital_id, "PAY-879", "Sarah Byrne", "TS-137 · General", "€146.25", "Queued")]),
        # professionals
        ("INSERT INTO professionals (hospital_id,name,role,specialty,rating,status) VALUES (?,?,?,?,?,?)",
         [(hospital_id, "Olivia Murphy", "Registered Nurse", "ICU", "4.9", "Available"),
          (hospital_id, "Ava O’Connor", "Registered Nurse", "Critical Care", "4.8", "On shift"),
          (hospital_id, "Sarah Byrne", "Registered Nurse", "General", "4.7", "Available"),
          (hospital_id, "Noah Fischer", "Healthcare Assistant", "Emergency", "4.6", "Available"),
          (hospital_id, "Priya Nair", "Pharmacist", "Pharmacy", "4.9", "On shift")]),
        # compliance
        ("INSERT INTO compliance (hospital_id,who,item,expires,status) VALUES (?,?,?,?,?)",
         [(hospital_id, "Olivia Murphy", "ICU certificate", "Mar 2027", "Valid"),
          (hospital_id, "Ava O’Connor", "BLS certification", "Oct 2026", "Expiring"),
          (hospital_id, "Noah Fischer", "Background check", "Sep 2026", "Expiring"),
          (hospital_id, "Priya Nair", "Pharmacy license", "Aug 2026", "Expired"),
          (hospital_id, "Sarah Byrne", "Immunization record", "Jan 2027", "Valid")]),
        # integrations
        ("INSERT INTO integrations (hospital_id,name,desc,status) VALUES (?,?,?,?)",
         [(hospital_id, "HR system", "Sync staff records and contracts", "Connected"),
          (hospital_id, "Payroll", "Push approved timesheets to payroll", "Connected"),
          (hospital_id, "Credential registry", "Auto-verify licenses and certificates", "Available"),
          (hospital_id, "Billing / ERP", "Export invoices to your finance stack", "Available")]),
    ]
    for sql, args in rows:
        db.conn().executemany(sql, args)
    db.conn().commit()
