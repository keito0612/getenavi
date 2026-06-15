import { authService } from "@/services/authService";
import { userService } from "@/services/userService";

export async function GET() {
  return userService.getUser();
}
