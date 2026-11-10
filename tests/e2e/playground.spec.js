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
  expect(css).not.toMatch(/(?:^|[;{])\s*(?:color|background(?:-color)?):/m);
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

test("palette presets update the preview and preserve custom per-design colors", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".css-export")).toBeVisible();
  const preview = page.locator(".direction:not([hidden])");
  await page
    .getByRole("combobox", { name: "Choose color palette" })
    .selectOption("coastal");
  await expect(preview.locator(".ui")).toHaveCSS("--nav", "#e0edf3");
  await expect(preview.locator(".ui")).toHaveClass(/palette-light/);
  await preview.getByLabel("Navigation", { exact: true }).fill("#112233");
  await expect(preview.locator(".ui")).toHaveCSS("--nav", "#112233");
  await page
    .getByRole("combobox", { name: "Choose color palette" })
    .selectOption("sand");
  await expect(preview.locator(".ui")).toHaveCSS("--nav", "#112233");
  await page.reload();
  await expect(page.locator(".css-export")).toBeVisible();
  await expect(page.locator(".direction:not([hidden]) .ui")).toHaveCSS(
    "--nav",
    "#112233",
  );
});

test("table settings update the selected layout and survive reload and export", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".css-export")).toBeVisible();
  await page.getByRole("checkbox", { name: "Show table preview" }).check();
  await page
    .getByRole("spinbutton", { name: "Table cell padding (px)" })
    .fill("21");
  await expect(
    page.locator(".direction:not([hidden]) table th").first(),
  ).toHaveCSS("padding", "21px");
  await page.getByRole("button", { name: "Next design" }).click();
  await expect(
    page.getByRole("checkbox", { name: "Show table preview" }),
  ).not.toBeChecked();
  await page.getByRole("button", { name: "Previous design" }).click();
  await expect(
    page.getByRole("checkbox", { name: "Show table preview" }),
  ).toBeChecked();
  await page.reload();
  await expect(page.locator(".css-export")).toBeVisible();
  await expect(
    page.locator(".direction:not([hidden]) table th").first(),
  ).toHaveCSS("padding", "21px");
  const pending = page.waitForEvent("download");
  await page.locator(".css-export").click();
  const download = await pending;
  const css = await readFile(await download.path(), "utf8");
  expect(css).toContain("21px");
});

test("footer options apply to the selected design, persist, and export", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".css-export")).toBeVisible();
  await page
    .getByRole("checkbox", { name: "Show additional footer information" })
    .check();
  await page
    .getByRole("spinbutton", { name: "Footer padding (px)" })
    .fill("27");
  const footer = page.locator(".direction:not([hidden]) .footer");
  await expect(footer).toContainText("Learning together, every day.");
  await expect(footer).toHaveCSS("padding", "27px");
  await page.getByRole("button", { name: "Next design" }).click();
  await expect(
    page.getByRole("checkbox", { name: "Show additional footer information" }),
  ).not.toBeChecked();
  await page.reload();
  await expect(page.locator(".css-export")).toBeVisible();
  await expect(
    page.getByRole("checkbox", { name: "Show additional footer information" }),
  ).toBeChecked();
  await expect(page.locator(".direction:not([hidden]) .footer")).toHaveCSS(
    "padding",
    "27px",
  );
  const pending = page.waitForEvent("download");
  await page.locator(".css-export").click();
  expect(await readFile(await (await pending).path(), "utf8")).toContain(
    "27px",
  );
});

test("typography and directional spacing update, persist, and reset by layout", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".css-export")).toBeVisible();
  await page
    .getByRole("spinbutton", { name: "text-base size in pixels" })
    .fill("19");
  await expect(page.locator(".direction:not([hidden]) .ui")).toHaveCSS(
    "--ed-base",
    "19px",
  );
  await page
    .getByRole("combobox", { name: "padding for main" })
    .selectOption("4");
  await page
    .getByRole("combobox", { name: "padding sides for main" })
    .selectOption("left");
  await page
    .getByRole("combobox", { name: "padding for main" })
    .selectOption("2");
  const main = page.locator(".direction:not([hidden]) .main");
  await expect(main).toHaveCSS("padding-top", "16px");
  await expect(main).toHaveCSS("padding-left", "8px");
  await page.reload();
  await expect(page.locator(".css-export")).toBeVisible();
  await expect(
    page.getByRole("spinbutton", { name: "text-base size in pixels" }),
  ).toHaveValue("19");
  await expect(page.locator(".direction:not([hidden]) .main")).toHaveCSS(
    "padding-left",
    "8px",
  );
  const pending = page.waitForEvent("download");
  await page.locator(".css-export").click();
  const css = await readFile(await (await pending).path(), "utf8");
  expect(css).toContain("19px");
  await page
    .getByRole("button", { name: "Reset typography and spacing" })
    .click();
  await expect(
    page.getByRole("spinbutton", { name: "text-base size in pixels" }),
  ).toHaveValue("16");
});

test("container shadow settings persist and reset with layout settings", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".css-export")).toBeVisible();
  await page
    .getByRole("combobox", { name: "Container shadow mode" })
    .selectOption("custom");
  await page
    .getByRole("spinbutton", { name: "Container shadow blur" })
    .fill("18");
  await expect(page.locator(".direction:not([hidden]) .main")).toHaveCSS(
    "box-shadow",
    /18px/,
  );
  await page.reload();
  await expect(page.locator(".css-export")).toBeVisible();
  await expect(
    page.getByRole("spinbutton", { name: "Container shadow blur" }),
  ).toHaveValue("18");
  await expect(page.locator(".direction:not([hidden]) .main")).toHaveCSS(
    "box-shadow",
    /18px/,
  );
  await page
    .getByRole("button", { name: "Reset typography and spacing" })
    .click();
  await expect(
    page.getByRole("combobox", { name: "Container shadow mode" }),
  ).toHaveValue("default");
});

test("automatic and custom page text colors update and persist", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".css-export")).toBeVisible();
  const visible = page.locator(".direction:not([hidden])");
  await visible.getByLabel("Choose text color automatically").uncheck();
  await visible.getByLabel("Custom page text color").fill("#123456");
  await expect(visible.locator(".ui")).toHaveCSS("--auto-page-text", "#123456");
  await page.reload();
  await expect(page.locator(".css-export")).toBeVisible();
  const reloaded = page.locator(".direction:not([hidden])");
  await expect(reloaded.getByLabel("Custom page text color")).toHaveValue(
    "#123456",
  );
  await expect(reloaded.locator(".ui")).toHaveCSS(
    "--auto-page-text",
    "#123456",
  );
  await reloaded.getByLabel("Choose text color automatically").check();
  await expect(reloaded.getByLabel("Custom page text color")).toBeDisabled();
  await expect(reloaded.locator(".ui")).not.toHaveCSS(
    "--auto-page-text",
    "#123456",
  );
});

test("heading and button colors apply and persist", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".css-export")).toBeVisible();
  let visible = page.locator(".direction:not([hidden])");
  await visible
    .getByRole("combobox", { name: "Main heading / H1 color mode" })
    .selectOption("custom");
  await visible
    .getByLabel("Main heading / H1 color", { exact: true })
    .fill("#aa3355");
  await visible.locator(".button-custom").check();
  await visible
    .getByLabel("Button background color", { exact: true })
    .fill("#113355");
  await expect(visible.locator(".ui")).toHaveCSS(
    "--custom-heading-1",
    "#aa3355",
  );
  await expect(visible.locator(".ui")).toHaveCSS(
    "--custom-button-bg",
    "#113355",
  );
  await page.reload();
  await expect(page.locator(".css-export")).toBeVisible();
  visible = page.locator(".direction:not([hidden])");
  await expect(
    visible.getByLabel("Main heading / H1 color", { exact: true }),
  ).toHaveValue("#aa3355");
  await expect(
    visible.getByLabel("Button background color", { exact: true }),
  ).toHaveValue("#113355");
});

test("component defaults and individual navigation overrides are applied and saved", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".css-export")).toBeVisible();
  let visible = page.locator(".direction:not([hidden])");
  await visible.getByLabel("Button styles font size").fill("22");
  await expect(visible.locator(".cta")).toHaveCSS("font-size", "22px");
  const nav = visible.getByLabel("Navigation styles apply to");
  await nav.selectOption("1");
  await visible.getByLabel("Navigation styles font weight").selectOption("700");
  await expect(visible.locator(".nav .item").nth(1)).toHaveCSS(
    "font-weight",
    "700",
  );
  await page.reload();
  await expect(page.locator(".css-export")).toBeVisible();
  visible = page.locator(".direction:not([hidden])");
  await expect(visible.locator(".cta")).toHaveCSS("font-size", "22px");
  await expect(visible.locator(".nav .item").nth(1)).toHaveCSS(
    "font-weight",
    "700",
  );
  const pending = page.waitForEvent("download");
  await page.locator(".css-export").click();
  const css = await readFile(await (await pending).path(), "utf8");
  expect(css).toContain("22px");
});

test("text role overrides and border radius persist and reset", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".css-export")).toBeVisible();
  let visible = page.locator(".direction:not([hidden])");
  await visible.getByLabel("Text role font size in pixels").fill("31");
  await visible
    .getByLabel("Text role padding", { exact: true })
    .selectOption("1rem");
  await page.getByLabel("main border radius value").fill("11");
  await expect(visible.locator(".main > h3")).toHaveCSS("font-size", "31px");
  await expect(visible.locator(".main > h3")).toHaveCSS("padding-top", "16px");
  await expect(visible.locator(".main")).toHaveCSS("border-radius", "11px");
  await page.reload();
  await expect(page.locator(".css-export")).toBeVisible();
  visible = page.locator(".direction:not([hidden])");
  await expect(visible.locator(".main > h3")).toHaveCSS("font-size", "31px");
  await expect(page.getByLabel("main border radius value")).toHaveValue("11");
  await page
    .getByRole("button", { name: "Reset typography and spacing" })
    .click();
  await expect(visible.getByLabel("Text role font size in pixels")).toHaveValue(
    "",
  );
  await expect(page.getByLabel("main border radius value")).toHaveValue("");
});

test("sample lists and navigation icons can be hidden per layout and restored", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".css-export")).toBeVisible();
  let visible = page.locator(".direction:not([hidden])");
  await expect(visible.getByLabel("Sample lists")).toBeVisible();
  await page.getByLabel("Show sample lists").uncheck();
  await visible.getByLabel("Show sidebar icons").uncheck();
  await expect(visible.getByLabel("Sample lists")).toHaveCount(0);
  await expect(visible.locator(".nav-icon").first()).toBeHidden();
  await page.getByRole("button", { name: "Next design" }).click();
  visible = page.locator(".direction:not([hidden])");
  await expect(page.getByLabel("Show sample lists")).toBeChecked();
  await expect(visible.getByLabel("Show sidebar icons")).toBeChecked();
  await page.reload();
  await expect(page.locator(".css-export")).toBeVisible();
  visible = page.locator(".direction:not([hidden])");
  await expect(page.getByLabel("Show sample lists")).not.toBeChecked();
  await expect(visible.getByLabel("Show sidebar icons")).not.toBeChecked();
  await expect(visible.locator(".nav-icon").first()).toBeHidden();
});

test("miniature preview appears offscreen and reflects live style changes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 600 });
  await page.goto("/");
  await page.locator("#li-marker").selectOption("square");
  await page.evaluate(() => window.scrollTo(0, 1800));

  const mini = page.getByRole("button", {
    name: "Return to full design preview",
  });
  await expect(mini).toBeVisible();
  await expect(mini.locator(".mini-clone")).toHaveCount(1);
  await expect(mini.locator(".mini-clone")).toHaveCSS(
    "--list-marker",
    "square",
  );
});

test("all layouts render after repeated switching without runtime errors", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const selector = page.getByRole("combobox", { name: "Choose a layout" });
  for (let index = 0; index < 14; index++) {
    await selector.selectOption(String(index));
    await expect(page.locator(".direction:not([hidden])")).toHaveCount(1);
    await expect(page.locator("#counter")).toHaveText(`${index + 1} / 14`);
  }
  expect(errors).toEqual([]);
});

test("existing saved settings from the previous implementation are restored", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "sheklei-design-playground-v1",
      JSON.stringify({ 0: { "--accent": "#aa4488" } }),
    );
    localStorage.setItem(
      "sheklei-design-layout-v1",
      JSON.stringify({
        0: { font: { base: 21 }, spacing: { main: { padding: "4" } } },
      }),
    );
    localStorage.setItem(
      "sheklei-element-styles-v1",
      JSON.stringify({
        0: {
          targets: { "heading-1": { size: "32px" } },
          radii: { main: "13px" },
        },
      }),
    );
    localStorage.setItem(
      "sheklei-component-styles-v1",
      JSON.stringify({ 0: { button: { global: { size: "23px" } } } }),
    );
    localStorage.setItem(
      "sheklei-table-styles-v1",
      JSON.stringify({ 0: { show: true, padding: 19 } }),
    );
    localStorage.setItem(
      "sheklei-footer-styles-v1",
      JSON.stringify({ 0: { details: true, padding: 29 } }),
    );
    localStorage.setItem(
      "sheklei-sample-list-visibility-v1",
      JSON.stringify({ 0: false }),
    );
  });
  await page.goto("/");
  const visible = page.locator(".direction:not([hidden])");
  await expect(visible.locator(".ui")).toHaveCSS("--accent", "#aa4488");
  await expect(visible.locator(".ui")).toHaveCSS("--ed-base", "21px");
  await expect(visible.locator(".main")).toHaveCSS("padding-top", "16px");
  await expect(visible.locator(".main")).toHaveCSS("border-radius", "13px");
  await expect(visible.locator(".main > h3")).toHaveCSS("font-size", "32px");
  await expect(visible.locator(".cta")).toHaveCSS("font-size", "23px");
  await expect(visible.locator("table th").first()).toHaveCSS(
    "padding",
    "19px",
  );
  await expect(visible.locator(".footer")).toHaveCSS("padding", "29px");
  await expect(page.getByLabel("Show sample lists")).not.toBeChecked();
});

test("storage failures leave controls usable and show a save warning", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error("Storage unavailable");
    };
  });
  await page.goto("/");
  await expect(page.locator("#layout-save-status")).toContainText(
    "could not save",
  );
  await page.locator("#li-marker").selectOption("square");
  await expect(page.locator(".direction:not([hidden]) .ui")).toHaveCSS(
    "--list-marker",
    "square",
  );
});
