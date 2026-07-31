import { test, expect, type Page } from "@playwright/test";

const widths = [360, 390, 430, 768, 1024, 1280, 1440] as const;

async function assertNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
    };
  });
  expect(
    overflow.scrollWidth,
    `horizontal overflow: scroll=${overflow.scrollWidth} client=${overflow.clientWidth}`,
  ).toBeLessThanOrEqual(overflow.clientWidth + 1);
}

test.describe("responsive public + admin", () => {
  for (const width of widths) {
    test(`home @${width}px no overflow + reserve CTA`, async ({ page }) => {
      await page.setViewportSize({
        width,
        height: width < 768 ? 800 : 900,
      });
      await page.goto("/demo");
      await expect(
        page.getByRole("heading", { name: /Música, gastronomia/i }),
      ).toBeVisible();
      await assertNoHorizontalOverflow(page);

      if (width < 768) {
        await expect(
          page.locator(".fixed.inset-x-0.bottom-0").getByRole("link", {
            name: /Reservar/i,
          }),
        ).toBeVisible();
      } else {
        await expect(
          page.getByRole("navigation", { name: "Principal" }),
        ).toBeVisible();
      }
    });
  }

  test("tablet map shows map + list together", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/demo/admin/mapa");
    await expect(page.getByRole("img", { name: /Mapa da casa/i })).toBeVisible();
    await expect(page.getByText("Lista rápida")).toBeVisible();
    await expect(
      page.getByRole("tablist", { name: /Visualização de espaços/i }),
    ).toHaveCount(0);
    await assertNoHorizontalOverflow(page);
  });

  test("phone map uses toggle not dual view", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/demo/admin/mapa");
    await expect(
      page.getByRole("tablist", { name: /Visualização de espaços/i }),
    ).toBeVisible();
    await assertNoHorizontalOverflow(page);
  });

  test("landscape phone home", async ({ page }) => {
    await page.setViewportSize({ width: 844, height: 390 });
    await page.goto("/demo");
    await expect(
      page.getByRole("heading", { name: /Música, gastronomia/i }),
    ).toBeVisible();
    await assertNoHorizontalOverflow(page);
  });

  test("admin mais opens sheet on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/demo/admin");
    await page.getByRole("button", { name: /Mais/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("link", { name: "Cardápio" })).toBeVisible();
  });

  test("wizard keyboard focus and sticky actions", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/demo/reservar/pagode-do-piska");
    await page.keyboard.press("Tab");
    await expect(page.getByTestId("wizard-next")).toBeVisible();
    await assertNoHorizontalOverflow(page);
  });

  test("desktop reservas filter rail", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/demo/admin/reservas");
    await expect(
      page.getByRole("tablist", { name: /Filtros de reservas/i }),
    ).toBeVisible();
    await assertNoHorizontalOverflow(page);
  });
});
