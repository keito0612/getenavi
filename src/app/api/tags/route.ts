import { tagService } from "@/services/tagService";

export async function GET() {
  return tagService.getTags();
}
