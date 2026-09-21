import { db } from "@/lib/db";

async function setup() {
  await db.batch([
    `CREATE TABLE IF NOT EXISTS services (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE NOT NULL, description TEXT NOT NULL, unit TEXT NOT NULL, price_label TEXT NOT NULL, icon TEXT NOT NULL, sort_order INTEGER NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS metrics (id INTEGER PRIMARY KEY AUTOINCREMENT, label TEXT UNIQUE NOT NULL, value TEXT NOT NULL, icon TEXT NOT NULL, sort_order INTEGER NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS reviews (id INTEGER PRIMARY KEY AUTOINCREMENT, quote TEXT UNIQUE NOT NULL, customer TEXT NOT NULL, context TEXT NOT NULL, rating INTEGER NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS plans (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE NOT NULL, price TEXT NOT NULL, description TEXT NOT NULL, features TEXT NOT NULL, featured INTEGER DEFAULT 0)`,
    `CREATE TABLE IF NOT EXISTS bookings (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, service TEXT NOT NULL, booking_date TEXT NOT NULL, booking_time TEXT NOT NULL, pickup_window TEXT NOT NULL, quantity INTEGER DEFAULT 1, notes TEXT DEFAULT '', status TEXT DEFAULT 'Cita solicitada', created_at TEXT DEFAULT (datetime('now')))`,
  ]);
  await db.batch([
    { sql: `INSERT OR IGNORE INTO services (name,description,unit,price_label,icon,sort_order) VALUES (?,?,?,?,?,?)`, args: ["Ropa casual","Camisetas, pantalones y prendas cotidianas con detergente hipoalergénico.","Por kilo","Cotiza al reservar","shirt",1] },
    { sql: `INSERT OR IGNORE INTO services (name,description,unit,price_label,icon,sort_order) VALUES (?,?,?,?,?,?)`, args: ["Ropa delicada","Lavado a mano controlado para blusas, vestidos y tejidos finos.","Por prenda","Cotiza al reservar","sparkles",2] },
    { sql: `INSERT OR IGNORE INTO services (name,description,unit,price_label,icon,sort_order) VALUES (?,?,?,?,?,?)`, args: ["Sneakers y deportivos","Limpieza profunda, cuidado de suela y protección del material.","Por par","Cotiza al reservar","footprints",3] },
    { sql: `INSERT OR IGNORE INTO services (name,description,unit,price_label,icon,sort_order) VALUES (?,?,?,?,?,?)`, args: ["Zapatos premium","Cuidado especializado para cuero, ante y materiales sensibles.","Por par","Cotiza al reservar","gem",4] },
    { sql: `INSERT OR IGNORE INTO metrics (label,value,icon,sort_order) VALUES (?,?,?,?)`, args: ["Clientes satisfechos","8,400+","users",1] },
    { sql: `INSERT OR IGNORE INTO metrics (label,value,icon,sort_order) VALUES (?,?,?,?)`, args: ["Entregas a tiempo","99.4%","clock",2] },
    { sql: `INSERT OR IGNORE INTO metrics (label,value,icon,sort_order) VALUES (?,?,?,?)`, args: ["Lavadas diarias","450+","bag",3] },
    { sql: `INSERT OR IGNORE INTO metrics (label,value,icon,sort_order) VALUES (?,?,?,?)`, args: ["Calificación promedio","4.8 ★","star",4] },
    { sql: `INSERT OR IGNORE INTO reviews (quote,customer,context,rating) VALUES (?,?,?,?,?)`, args: ["Finalmente alguien que lava mis Air Jordans como se debe. Llegaron impecables y antes de lo esperado.","María R.","Cliente en Bogotá",5] },
    { sql: `INSERT OR IGNORE INTO reviews (quote,customer,context,rating) VALUES (?,?,?,?,?)`, args: ["Me ahorra horas cada semana. Reservo desde la cama, recogen y entregan sin drama.","Carlos M.","Cliente en Medellín",5] },
    { sql: `INSERT OR IGNORE INTO reviews (quote,customer,context,rating) VALUES (?,?,?,?,?)`, args: ["Confío en ellos con mis prendas más delicadas. El seguimiento hace todo muy fácil.","Lucía V.","Cliente en Cali",5] },
    { sql: `INSERT OR IGNORE INTO plans (name,price,description,features,featured) VALUES (?,?,?,?,?)`, args: ["Básico","$15.000 al mes","Para tu ropa cotidiana.","Hasta 5 kg semanales|Ropa casual|Entrega estándar|Soporte por chat",0] },
    { sql: `INSERT OR IGNORE INTO plans (name,price,description,features,featured) VALUES (?,?,?,?,?)`, args: ["Premium","$28.000 al mes","Cuidado completo y prioridad.","Hasta 12 kg semanales|Incluye prendas delicadas|Entrega prioritaria|Soporte por WhatsApp",1] },
    { sql: `INSERT OR IGNORE INTO plans (name,price,description,features,featured) VALUES (?,?,?,?,?)`, args: ["VIP","$49.000 al mes","Máxima comodidad y cuidado.","Peso ilimitado|Todos los servicios|Entrega prioritaria|Atención preferente",0] },
  ]);
}

export async function GET() {
  await setup();
  const [services, metrics, reviews, plans] = await Promise.all([
    db.execute("SELECT * FROM services ORDER BY sort_order"),
    db.execute("SELECT * FROM metrics ORDER BY sort_order"),
    db.execute("SELECT * FROM reviews ORDER BY id"),
    db.execute("SELECT * FROM plans ORDER BY id"),
  ]);
  return Response.json({ services: services.rows, metrics: metrics.rows, reviews: reviews.rows, plans: plans.rows });
}
