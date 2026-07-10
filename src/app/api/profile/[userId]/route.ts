import { NextRequest } from 'next/server';
import { profileService } from "@/services/profileService";

type Params = {
    params: Promise<{ userId: string }>;
}
export async function GET(request: NextRequest, { params }: Params) {
    const { userId } = await params;
    return profileService.getProfile(request, userId);
}
