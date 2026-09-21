import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-secret-change-in-prod");
export async function POST(req: Request) {
  const { email, password, name } = await req.json();
  if (!email || !password || password.length < 8) return Response.json({ error: "Usa un correo y una contraseña de mínimo 8 caracteres" }, { status: 400 });
  await db.execute(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, name TEXT, password_hash TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')))`);
  const found = await db.execute({ sql: "SELECT id FROM users WHERE email=?", args: [email] });
  if (found.rows.length) return Response.json({ error: "Este correo ya está registrado" }, { status: 409 });
  const hash = await bcrypt.hash(password, 12);
  await db.execute({ sql: "INSERT INTO users (email,name,password_hash) VALUES (?,?,?)", args: [email,name ?? "",hash] });
  const token = await new SignJWT({ email, name }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").sign(secret);
  return new Response(JSON.stringify({ ok: true, email, name }), { status: 201, headers: { "Content-Type":"application/json", "Set-Cookie":`session=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800` } });
}
