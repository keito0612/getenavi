export class UtilAuth {
  static async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const hashed = await this.hashPassword(password);
    return hashed === hashedPassword;
  }
}
