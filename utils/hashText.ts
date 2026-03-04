import bcrypt from "bcrypt";

export async function hashText(text: string) {
  const saltRounds = 5;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(text, salt);
  return hash;
}
