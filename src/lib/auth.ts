// src/lib/auth.ts
import users from "../data/users";

// Student login
export function studentLogin(email: string, password: string) {
  const student = users.students.find(
    (s) => s.email === email && s.password === password
  );
  return student || null;
}

// Warden login
export function wardenLogin(email: string, password: string) {
  const warden = users.wardens.find(
    (w) => w.email === email && w.password === password
  );
  return warden || null;
}
