import { tagService } from "@/services/tagService";

export const runtime = "edge";

export async function GET() {
  return tagService.getTags();
}
