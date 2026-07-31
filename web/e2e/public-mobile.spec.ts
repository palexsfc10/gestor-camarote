import { test, expect, type Page } from "@playwright/test";
import path from "path";
import fs from "fs";

const shotDir = path.join("test-results", "public-mobile-shots");

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

async function fullPageShot(page: Page, name: string) {
  fs.mkdirSync(shotDir, { recursive: true });
  await page.screenshot({
    path: path.join(shotDir, `${name}.png`),
    fullPage: true,
  });
}

const publicViewports = [
  { name: "360", width: 360, height: 800 },
  { name: "390", width: 390, height: 844 },
  { name: "430", width: 430, height: 932 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1440", width: 1440, height: 900 },
] as const;

test.describe("public mobile-first review", () => {
  for (const vp of publicViewports) {
    test(`home overflow + shot @${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/demo");
      await expect(
        page.getByRole("heading", { name: /Música, gastronomia/i }),
      ).toBeVisible();
      await assertNoHorizontalOverflow(page);
      await fullPageShot(page, `home-${vp.name}`);
    });
  }

  test("mobile menu opens without covering sticky CTA incorrectly", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/demo");
    await page.getByRole("button", { name: /Abrir menu/i }).click();
    const menu = page.getByRole("dialog", { name: /Menu/i });
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link", { name: "Aniversários" })).toBeVisible();
    await expect(menu.getByRole("link", { name: /Reservar agora/i })).toBeVisible();
    await menu.getByRole("button", { name: /Fechar menu/i }).click();
    await expect(menu).toHaveCount(0);
    await expect(page.getByTestId("sticky-public-cta")).toBeVisible();
  });

  test("birthday mobile order and flyer amplify", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/demo#aniversarios");
    await expect(
      page.getByRole("heading", { name: /Aniversário com estilo/i }),
    ).toBeVisible();
    await expect(page.getByRole("tablist", { name: /Pacotes/i })).toBeVisible();
    await page.getByRole("tab", { name: /30/ }).click();
    await expect(page.getByRole("tabpanel")).toContainText(/30 convidados/i);
    await page
      .locator("#aniversarios")
      .getByRole("button", { name: /Ampliar/i })
      .first()
      .click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: /Fechar ampliação/i }).click();
    await fullPageShot(page, "birthday-390");
  });

  test("experiences carousel readable at 390", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/demo#experiencias");
    await expect(page.getByRole("heading", { name: /Camarote/i }).first()).toBeVisible();
    await expect(
      page.getByText(/Deslize para ver Camarote, Mesa e Aniversário/i),
    ).toBeVisible();
    await assertNoHorizontalOverflow(page);
  });

  test("event detail mobile: meta before flyer amplify", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/demo/eventos/noite-do-piseiro");
    await expect(
      page.getByRole("heading", { level: 1, name: /Noite do Piseiro/i }),
    ).toBeVisible();
    await page.getByRole("button", { name: /Ampliar/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: /Fechar ampliação/i }).click();
    await expect(page.getByTestId("sticky-public-cta")).toBeVisible();
    await assertNoHorizontalOverflow(page);
    await fullPageShot(page, "event-detail-390");
  });

  test("wizard journeys mesa camarote aniversario @390", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    for (const tipo of ["mesa", "camarote", "aniversario"] as const) {
      await page.goto(`/demo/reservar/pagode-do-piska?tipo=${tipo}`);
      await page.getByTestId(`experience-${tipo}`).click();
      await expect(page.getByText(/Etapa 2/)).toBeVisible();
      if (tipo === "mesa") {
        await expect(page.getByText("Camarote 07")).toHaveCount(0);
        await expect(page.getByRole("button", { name: /Mesa 02/ })).toBeVisible();
      }
      if (tipo === "camarote") {
        await expect(page.getByText("Mesa 01")).toHaveCount(0);
        await expect(page.getByText("Camarote 07").first()).toBeVisible();
      }
      await assertNoHorizontalOverflow(page);
      await expect(page.getByTestId("wizard-next")).toBeVisible();
    }
  });

  test("desktop 1440 keeps side-by-side birthday packages grid", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/demo#aniversarios");
    await expect(page.getByRole("tablist", { name: /Pacotes/i })).toHaveCount(0);
    await expect(page.getByText(/10 convidados/i)).toBeVisible();
    await expect(page.getByText(/30 convidados/i)).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "Principal" }),
    ).toBeVisible();
    await assertNoHorizontalOverflow(page);
    await fullPageShot(page, "home-desktop-1440-birthday");
  });

  test("landscape phone home", async ({ page }) => {
    await page.setViewportSize({ width: 844, height: 390 });
    await page.goto("/demo");
    await assertNoHorizontalOverflow(page);
    await fullPageShot(page, "home-landscape-844x390");
  });

  test("tablet 768 birthday two-column composition", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/demo#aniversarios");
    await expect(
      page.getByRole("heading", { name: /Aniversário com estilo/i }),
    ).toBeVisible();
    await expect(page.getByRole("tablist", { name: /Pacotes/i })).toHaveCount(0);
    await assertNoHorizontalOverflow(page);
    await fullPageShot(page, "birthday-768");
  });
});
