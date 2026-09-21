import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-secret-change-in-prod");
export async function POST(req: Request) {
  const { email, password } = await req.json();
  await db.execute(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, name TEXT, password_hash TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')))`);
  const { rows } = await db.execute({ sql: "SELECT id,email,name,password_hash FROM users WHERE email=?", args: [email ?? ""] });
  const user = rows[0] as { email:string; name:string; password_hash:string } | undefined;
  if (!user || !await bcrypt.compare(password ?? "", user.password_hash)) return Response.json({ error: "Correo o contraseña incorrectos" }, { status: 401 });
  const token = await new SignJWT({ email:user.email,name:user.name }).setProtectedHeader({ alg:"HS256" }).setExpirationTime("7d").sign(secret);
  return new Response(JSON.stringify({ ok:true,email:user.email,name:user.name }), { headers:{ "Content-Type":"application/json", "Set-Cookie":`session=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800` } });
}
