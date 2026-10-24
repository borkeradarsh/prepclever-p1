"use server";

import { revalidatePath } from "next/cache";
import { getBlockItem, markItemDone } from "@/lib/data";
import { itemKey } from "@/lib/progress";

/**
 * Marks a block item done or not done. The slugs come from the client, so the
 * item is looked up again and access re-checked here: a locked or coming-soon
 * item can never be marked done by posting its slug.
 */
export async function setItemDoneAction(blockSlug: string, itemSlug: string, done: boolean) {
  const view = await getBlockItem(blockSlug, itemSlug);
  if (!view || view.locked || view.item.status !== "available") return;

  await markItemDone(itemKey(view.block.slug, view.item.slug), done);
  // The sidebar's ticks and progress live in the layout, so refresh it too.
  revalidatePath("/", "layout");
}
