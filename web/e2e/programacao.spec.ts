import { test, expect, type Page } from "@playwright/test";
import path from "path";
import fs from "fs";

const shotDir = path.join("test-results", "programacao-shots");

async function assertNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
    };
  });
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
}

async function shot(page: Page, name: string) {
  fs.mkdirSync(shotDir, { recursive: true });
  const section = page.getByTestId("week-programacao");
  await section.scrollIntoViewIfNeeded();
  await section.screenshot({ path: path.join(shotDir, `${name}.png`) });
}

const viewports = [
  { name: "360", width: 360, height: 800 },
  { name: "390", width: 390, height: 844 },
  { name: "430", width: 430, height: 932 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1440", width: 1440, height: 900 },
] as const;

test.describe("programação week carousel", () => {
  for (const vp of viewports) {
    test(`consistent cards + no page overflow @${vp.name}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/demo");
      const section = page.getByTestId("week-programacao");
      await expect(section).toBeVisible();
      await assertNoHorizontalOverflow(page);

      const heights = await page.evaluate(() => {
        const cards = [
          ...document.querySelectorAll<HTMLElement>("[data-program-card]"),
        ];
        return cards
          .slice(0, 3)
          .map((c) => Math.round(c.getBoundingClientRect().height));
      });
      expect(heights.length).toBeGreaterThan(1);
      const max = Math.max(...heights);
      const min = Math.min(...heights);
      expect(max - min).toBeLessThanOrEqual(2);

      await shot(page, `programacao-${vp.name}`);
    });
  }

  test("scroller allows vertical pan (touch-action) @390", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/demo");
    const scroller = page.getByTestId("week-programacao-scroller");
    await scroller.scrollIntoViewIfNeeded();

    const touchAction = await scroller.evaluate(
      (el) => getComputedStyle(el).touchAction,
    );
    expect(touchAction).toMatch(/manipulation/);

    // Sem Embla: overflow nativo horizontal
    const overflowX = await scroller.evaluate(
      (el) => getComputedStyle(el).overflowX,
    );
    expect(overflowX).toMatch(/auto|scroll/);
  });

  test("vertical gesture over flyer is not trapped @390", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/demo");
    await page.evaluate(() => window.scrollTo(0, 0));

    const section = page.getByTestId("week-programacao");
    await section.evaluate((el) =>
      el.scrollIntoView({ block: "center", inline: "nearest" }),
    );

    const flyer = page.getByTestId("program-flyer").first();
    await expect(flyer).toBeVisible();

    // Flyers/cards não usam touch-action que bloqueia pan vertical
    const flyerTouch = await flyer.evaluate(
      (el) => getComputedStyle(el).touchAction,
    );
    expect(flyerTouch).not.toMatch(/^(none|pan-x)$/);

    const scroller = page.getByTestId("week-programacao-scroller");
    const scrollerTouch = await scroller.evaluate(
      (el) => getComputedStyle(el).touchAction,
    );
    expect(scrollerTouch).toMatch(/manipulation/);

    const room = await page.evaluate(() => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      return { before: window.scrollY, max };
    });
    expect(room.max - room.before).toBeGreaterThan(80);

    await flyer.hover();
    await page.mouse.wheel(0, 320);
    const after = await page.evaluate(() => window.scrollY);
    expect(after).toBeGreaterThan(room.before + 20);
  });

  test("horizontal scroll navigates events @390", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/demo");
    const scroller = page.getByTestId("week-programacao-scroller");
    await scroller.scrollIntoViewIfNeeded();
    const before = await scroller.evaluate((el) => el.scrollLeft);

    await scroller.evaluate((el) => {
      el.scrollBy({ left: 220, behavior: "auto" });
    });
    const after = await scroller.evaluate((el) => el.scrollLeft);
    expect(after).toBeGreaterThan(before + 40);

    // Drag path also works without preventing page overflow
    await assertNoHorizontalOverflow(page);
  });

  test("tap Ver evento opens detail @390", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/demo");
    const section = page.getByTestId("week-programacao");
    await section.scrollIntoViewIfNeeded();
    await section.getByRole("link", { name: /Ver evento/i }).first().click();
    await expect(page).toHaveURL(/\/demo\/eventos\//);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("keyboard focus reaches Ver evento CTA", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/demo");
    await page.getByTestId("week-programacao").scrollIntoViewIfNeeded();
    const cta = page
      .getByTestId("week-programacao")
      .getByRole("link", { name: /Ver evento/i })
      .first();
    await cta.focus();
    await expect(cta).toBeFocused();
  });

  test("desktop arrows do not break layout @1440", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/demo");
    const section = page.getByTestId("week-programacao");
    await expect(
      section.getByRole("button", { name: "Anterior" }),
    ).toBeVisible();
    await expect(section.getByRole("button", { name: "Próximo" })).toBeVisible();
    await section.getByRole("button", { name: "Próximo" }).click();
    await assertNoHorizontalOverflow(page);
  });
});
