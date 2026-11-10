import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

test("layout controls select the intended preview and wrap around", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".css-export")).toBeVisible();
  await expect(page.locator(".direction:not([hidden]) h2")).toHaveText(
    "Academic Editorial",
  );
  await page
    .getByRole("combobox", { name: "Choose a layout" })
    .selectOption("5");
  await expect(page.locator(".direction:not([hidden]) h2")).toHaveText(
    "Compact icon rail",
  );
  await expect(page.locator("#editor-current")).toContainText(
    "Compact icon rail",
  );
  await page.getByRole("button", { name: "Next design" }).click();
  await expect(page.locator(".direction:not([hidden]) h2")).toHaveText(
    "Split workspace",
  );
  await expect(page.locator("#editor-current")).toContainText(
    "Split workspace",
  );
  await page
    .getByRole("combobox", { name: "Choose a layout" })
    .selectOption("13");
  await page.getByRole("button", { name: "Next design" }).click();
  await expect(page.locator(".direction:not([hidden]) h2")).toHaveText(
    "Academic Editorial",
  );
});

test("color setting persists and CSS export downloads", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".css-export")).toBeVisible();
  await page.getByRole("checkbox", { name: "Disable color scheme" }).check();
  await expect(page.locator("body")).toHaveClass(/colors-disabled/);
  await page.reload();
  await expect(
    page.getByRole("checkbox", { name: "Disable color scheme" }),
  ).toBeChecked();
  await expect(page.locator(".css-export")).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await page.locator(".css-export").click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("App.css");
  const css = await readFile(await download.path(), "utf8");
  expect(css).toContain('@import "tailwindcss"');
  expect(css).toContain(".ui");
});

test("sample list styles update the selected preview and persist independently", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".css-export")).toBeVisible();
  await page.locator("#li-marker").selectOption("square");
  await expect(page.locator(".direction:not([hidden]) .ui")).toHaveCSS(
    "--list-marker",
    "square",
  );
  await page.getByRole("button", { name: "Next design" }).click();
  await expect(page.locator("#li-marker")).toHaveValue("");
  await page.locator("#li-marker").selectOption("circle");
  await page.reload();
  await expect(page.locator(".css-export")).toBeVisible();
  await expect(page.locator("#li-marker")).toHaveValue("square");
  await page.getByRole("button", { name: "Next design" }).click();
  await expect(page.locator("#li-marker")).toHaveValue("circle");
  await expect(page.locator(".direction:not([hidden]) .ui")).toHaveCSS(
    "--list-marker",
    "circle",
  );
});
