import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function configure(page: Page, theme: string, mode: string, density: string) {
  await page.getByLabel("Theme", { exact: true }).selectOption(theme);
  await page.getByLabel("Mode", { exact: true }).selectOption(mode);
  await page.getByLabel("Density", { exact: true }).selectOption(density);
}

for (const theme of ["warm", "crisp"])
  for (const mode of ["light", "dark"])
    for (const density of ["comfortable", "compact"]) {
      test(`${theme} / ${mode} / ${density}: role contrast, screens and accessibility`, async ({
        page,
      }) => {
        await page.goto("/");
        await configure(page, theme, mode, density);
        const contrast = await page
          .locator(".ui-theme")
          .first()
          .evaluate((element) => {
            const style = getComputedStyle(element);
            const read = (role: string) => style.getPropertyValue(`--ui-${role}`).trim();
            function luminance(hex: string) {
              const rgb = hex
                .replace("#", "")
                .match(/.{2}/g)!
                .slice(0, 3)
                .map((v) => parseInt(v, 16) / 255)
                .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
              return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
            }
            const pairs: [string, string, number][] = [];
            for (const bg of ["canvas", "surface", "sunken", "overlay", "hover", "pressed"]) {
              for (const fg of ["fg", "muted"]) pairs.push([fg, bg, 4.5]);
              pairs.push(["focus", bg, 3], ["input-border", bg, 3], ["selection-border", bg, 3]);
            }
            pairs.push(
              ["on-action", "action", 4.5],
              ["on-action", "action-hover", 4.5],
              ["on-danger", "danger", 4.5],
              ["on-danger", "danger-hover", 4.5],
              ["on-selected", "selected", 4.5],
              ["on-selected", "surface", 4.5],
              ["on-selection-border", "selection-border", 4.5],
              ["danger-text", "surface", 4.5],
              ["danger-text", "overlay", 4.5],
              ["selection-border", "selected", 3],
            );
            for (const status of ["success", "warning", "danger", "info"])
              pairs.push([`${status}-text`, `${status}-soft`, 4.5]);
            return pairs.map(([fg, bg, minimum]) => {
              const [a, b] = [luminance(read(fg)), luminance(read(bg))].sort((x, y) => y - x);
              return { fg, bg, minimum, ratio: (a + 0.05) / (b + 0.05) };
            });
          });
        for (const pair of contrast)
          expect(pair.ratio, `${pair.fg} on ${pair.bg}`).toBeGreaterThanOrEqual(pair.minimum);
        const controlHeight = await page
          .getByRole("textbox", { name: "Workspace name" })
          .evaluate((el) => el.getBoundingClientRect().height);
        expect(controlHeight).toBe(density === "compact" ? 36 : 44);
        for (const name of ["Settings", "Resources", "Components"]) {
          await page.getByRole("button", { name, exact: true }).click();
          const results = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze();
          expect(results.violations).toEqual([]);
        }
      });
    }

test("nested dialog and menu preserve scope, keyboard operation and focus return", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Components", exact: true }).click();
  const trigger = page.getByRole("button", { name: "Open scoped dialog" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveCSS("background-color", "rgb(27, 41, 64)");
  expect(
    await dialog.evaluate((el) => el.closest("[data-ui-theme]")?.getAttribute("data-ui-theme")),
  ).toBe("crisp");
  const roleTrigger = dialog.getByRole("button", { name: "Role: Member" });
  await roleTrigger.focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("menu")).toBeVisible();
  await expect(page.getByRole("menu")).toHaveCSS("background-color", "rgb(27, 41, 64)");
  await page.keyboard.press("End");
  await expect(page.getByRole("menuitem", { name: "Guest", exact: true })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(dialog.getByRole("button", { name: "Role: Guest" })).toBeFocused();
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press("Tab");
    expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true);
  }
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(results.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("local invitations validate and close without a network request", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Invite teammate" }).click();
  await page.getByRole("button", { name: "Create invitation" }).click();
  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Teammate email" })).toBeFocused();
  await page.getByRole("textbox", { name: "Teammate email" }).fill("friend@example.com");
  await page.getByRole("button", { name: "Create invitation" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByRole("status").filter({ hasText: "Invitation preview" })).toHaveText(
    "Invitation preview created for friend@example.com. No email was sent.",
  );
});

test("mobile RTL, reflow, reduced motion and forced colors remain usable", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByLabel("Direction", { exact: true }).selectOption("rtl");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  const overflowing = await page.locator("#main-content *").evaluateAll((elements) =>
    elements
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && (rect.left < -1 || rect.right > innerWidth + 1);
      })
      .map((el) => el.tagName),
  );
  expect(overflowing).toEqual([]);
  await page.getByRole("button", { name: "Resources", exact: true }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.getByRole("textbox", { name: "Search resources" }).fill("no match");
  await expect(page.getByText("No resources found")).toBeVisible();
  await page.getByRole("button", { name: "Clear search" }).click();
  await page.getByRole("button", { name: "Invite teammate" }).click();
  await expect(page.getByRole("dialog")).toBeInViewport({ ratio: 1 });
  await page.keyboard.press("Escape");
  await page.emulateMedia({ forcedColors: "active" });
  const invite = page.getByRole("button", { name: "Invite teammate" });
  await invite.focus();
  expect(await invite.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe("solid");
});

test("keyboard tabs, high-contrast switch/menu, and reduced motion retain feedback", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("Theme", { exact: true }).selectOption("crisp");
  const toggle = page.getByRole("switch", { name: "Email digests" });
  await page.emulateMedia({ forcedColors: "active" });
  const thumb = toggle.locator("span");
  const checkedColor = await thumb.evaluate((el) => getComputedStyle(el).backgroundColor);
  await toggle.click();
  await expect(toggle).toHaveAttribute("data-state", "unchecked");
  expect(await thumb.evaluate((el) => getComputedStyle(el).backgroundColor)).not.toBe(checkedColor);
  await page.getByRole("button", { name: "Resources", exact: true }).click();
  await page.getByRole("button", { name: "Actions for Brand foundations" }).focus();
  await page.keyboard.press("ArrowDown");
  const item = page.getByRole("menuitem", { name: "Move to draft" });
  await expect(item).toBeFocused();
  expect(await item.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe("solid");
  await page.keyboard.press("Escape");
  await page.emulateMedia({ forcedColors: "none", reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Components", exact: true }).click();
  await page.getByRole("tab", { name: "Overview", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Activity", exact: true })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  const spinner = page.getByRole("button", { name: "Saving" }).locator("svg");
  expect(
    await spinner.evaluate((el) => parseFloat(getComputedStyle(el).animationDuration)),
  ).toBeLessThan(0.01);
});

test("nested modal backdrop covers the viewport and returns focus to its parent", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Components", exact: true }).click();
  await page.getByRole("button", { name: "Open scoped dialog" }).click();
  const trigger = page.getByRole("button", { name: "Open nested dialog" });
  await trigger.click();
  const inner = page.getByRole("dialog", { name: "A second layer", exact: true });
  await expect(inner).toBeVisible();
  const backdrop = await page.locator("[data-ui-dialog-overlay]").last().boundingBox();
  const viewport = page.viewportSize()!;
  expect(backdrop).toEqual({ x: 0, y: 0, width: viewport.width, height: viewport.height });
  await expect(inner).toBeInViewport({ ratio: 1 });
  const outer = page.getByRole("dialog", { name: "A theme that follows you", exact: true });
  expect(await outer.evaluate((el) => getComputedStyle(el).translate)).toBe("none");
  await page.getByRole("button", { name: "Close nested dialog", exact: true }).click();
  await expect(inner).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(outer).not.toBeVisible();
});
