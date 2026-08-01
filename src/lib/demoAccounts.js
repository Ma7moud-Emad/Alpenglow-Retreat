/**
 * Accounts offered on the home page so a visitor can see the staff dashboard
 * without asking anyone for a login.
 *
 * These credentials are deliberately public: they ship in the JavaScript
 * bundle and anyone can read them. That is fine only because the database they
 * reach is seed data. Two things follow from that:
 *
 *   1. Never put a real member of staff in this list.
 *   2. Whatever an admin can do here, a stranger can do. If you would mind a
 *      visitor deleting a cabin, do not publish the admin row.
 *
 * Leave the array empty and the dialog never renders, so the site behaves as it
 * did before.
 */
export const DEMO_ACCOUNTS = [
  // {
  //   role: "Admin",
  //   email: "admin@alpenglow.test",
  //   password: "admin@alpenglow.test",
  //   blurb: "Every screen, plus the team page and role changes",
  // },
  // {
  //   role: "Receptionist",
  //   email: "reception@alpenglow.test",
  //   password: "reception@alpenglow.test",
  //   blurb: "Enquiries, bookings, check-in and the cabin list",
  // },
];

/** The line under the list. Set to null to leave it out. */
export const DEMO_NOTE =
  "Every demo account uses its email address as its password. Seed data only, " +
  "so feel free to change anything.";

export const hasDemoAccounts = DEMO_ACCOUNTS.length > 0;
