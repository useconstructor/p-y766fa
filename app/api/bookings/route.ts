import { db } from "@/lib/db";

const table = `CREATE TABLE IF NOT EXISTS bookings (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, service TEXT NOT NULL, booking_date TEXT NOT NULL, booking_time TEXT NOT NULL, pickup_window TEXT NOT NULL, quantity INTEGER DEFAULT 1, notes TEXT DEFAULT '', status TEXT DEFAULT 'Cita solicitada', created_at TEXT DEFAULT (datetime('now')))`;

export async function GET(req: Request) {
  await db.execute(table);
  const email = new URL(req.url).searchParams.get("email");
  if (!email) return Response.json([]);
  const { rows } = await db.execute({ sql: "SELECT id,service,booking_date,booking_time,pickup_window,quantity,status,created_at FROM bookings WHERE email=? ORDER BY created_at DESC", args: [email] });
  return Response.json(rows);
}

export async function POST(req: Request) {
  await db.execute(table);
  const b = await req.json();
  if (!b.name || !b.email || !b.service || !b.date || !b.time || !b.pickupWindow) return Response.json({ error: "Completa los campos requeridos" }, { status: 400 });
  await db.execute({ sql: "INSERT INTO bookings (name,email,service,booking_date,booking_time,pickup_window,quantity,notes) VALUES (?,?,?,?,?,?,?,?)", args: [b.name,b.email,b.service,b.date,b.time,b.pickupWindow,Number(b.quantity)||1,b.notes ?? ""] });
  const { rows } = await db.execute({ sql: "SELECT id,service,booking_date,booking_time,pickup_window,quantity,status,created_at FROM bookings WHERE id=last_insert_rowid()", args: [] });
  return Response.json(rows[0], { status: 201 });
}
