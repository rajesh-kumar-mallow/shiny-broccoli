// Ported from the standalone `timesheet-auto-approve.js` console script:
// drives the approve / efficiency / authorise controls for every row under
// #timesheet-lists, with human-ish random delays between clicks.

const MIN_DELAY = 250;
const MAX_DELAY = 700;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const humanDelay = () => sleep(MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY));

const clickWithDelay = async (el: Element | null) => {
  if (!el) return false;
  await humanDelay();
  (el as HTMLElement).click();
  await humanDelay();
  return true;
};

// Pick the clickable checkbox div (not the readonly input) among elements
// sharing the same data-* attribute + id, since these ids collide in the markup.
const findCheckbox = (container: Element, attr: string, id: string) => {
  const matches = container.querySelectorAll(`[${attr}="${id}"]`);
  return Array.from(matches).find((el) => el.tagName !== "INPUT") || null;
};

export type AutoApproveProgress = {
  processed: number;
  total: number;
  id: string;
};

export async function runTimesheetAutoApprove(
  onProgress?: (progress: AutoApproveProgress) => void,
  runAuthoriseSteps = true,
): Promise<{ processed: number; total: number }> {
  const container = document.getElementById("timesheet-lists");
  if (!container) {
    console.warn("#timesheet-lists not found");
    return { processed: 0, total: 0 };
  }

  const ids = Array.from(
    new Set(
      Array.from(container.querySelectorAll("[data-approve]")).map((el) =>
        el.getAttribute("data-approve"),
      ),
    ),
  ).filter((id): id is string => !!id);

  console.log(`Found ${ids.length} timesheet row(s) to process.`);

  let processed = 0;

  for (const id of ids) {
    console.log(`Processing timesheet ${id}`);

    const approveDisplay = document.getElementById(`${id}_approve_display`);
    const approveCheckbox = findCheckbox(container, "data-approve", id);

    (approveCheckbox || approveDisplay)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    await humanDelay();

    if (approveCheckbox) {
      if (approveDisplay && approveDisplay.classList.contains("hidden")) {
        await clickWithDelay(approveCheckbox);
      } else {
        console.log(`  ${id}: already approved, skipping click, moving on`);
      }
    }

    if (runAuthoriseSteps) {
      const efficiencyCheckbox = findCheckbox(container, "data-efficiency", id);
      await clickWithDelay(efficiencyCheckbox);

      const authoriseSelect = document.getElementById(`${id}_authorise_select`);
      if (authoriseSelect) {
        const optionDiv = authoriseSelect.nextElementSibling;
        if (optionDiv) {
          await clickWithDelay(optionDiv);
        } else {
          console.log(`  ${id}: no option div found next to the authorise select`);
        }
      } else {
        console.log(`  ${id}: no authorise select found`);
      }
    } else {
      console.log(`  ${id}: only-approve mode, skipping efficiency/authorise steps`);
    }

    processed += 1;
    onProgress?.({ processed, total: ids.length, id });

    await humanDelay();
  }

  console.log("Done processing all timesheet rows.");
  return { processed, total: ids.length };
}
