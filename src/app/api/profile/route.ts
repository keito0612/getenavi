import { NextRequest } from "next/server";
import { profileService } from "@/services/profileService";

export async function GET(request: NextRequest) {
  return profileService.getProfile(request);
}

export async function PATCH(request: NextRequest) {
  return profileService.updateProfile(request);
}
