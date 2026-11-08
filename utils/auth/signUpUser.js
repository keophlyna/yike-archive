
// Creates the account with Supabase Auth. The names travel as sign-up metadata
// and a database trigger copies them into public.profiles, because a browser
// insert would be blocked by row-level security whenever sign-up returns no
// session (email confirmation on). See the profiles_names migration.
//
// Returns { ok: true, session } on success, or { ok: false, step, error, message }
// on failure. The error object is for console.error only; `message` is the
// short, safe line the caller shows to the user.

import formText from "../form/formText.js";
import { checkName } from "../form/validateEntry.js";

const ERROR_TEXT_KEYS = { user_already_exists: "emailTaken", email_exists: "emailTaken", weak_password: "weakPassword" };

export async function signUpUser({ supabase, email, password, firstName, lastName, language = "en" }) {
  const t = formText[language] || formText.en;
  const first = firstName.trim();
  const last = lastName.trim();

  const nameError = checkName(first, language) || checkName(last, language);
  if (nameError) return { ok: false, step: "validate", error: null, message: nameError };

  // full_name is what the home page header already reads from user_metadata.
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { first_name: first, last_name: last, full_name: `${first} ${last}` } },
  });

  if (error) {
    console.error("Sign-up failed:", error);
    return { ok: false, step: "signup", error, message: t[ERROR_TEXT_KEYS[error.code]] || t.createFailed };
  }

  return { ok: true, session: data.session };
}
