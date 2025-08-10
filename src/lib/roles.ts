// lib/roles.ts
export const ADMIN_EMAILS = [
  "saad.masood8.sm@gmail.com", // Replace with your actual email
//   "admin@yourdomain.com",  
];

export const isAdminEmail = (email: string): boolean => {
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

export const determineUserRole = (email: string): "user" | "admin" => {
  return isAdminEmail(email) ? "admin" : "user";
};