import { test, expect } from "@playwright/test";

test("perola public home uses real brand assets", async ({ page }) => {
  await page.goto("/demo");
  await expect(page.getByAltText("Pérola Gastrobar").first()).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Música, gastronomia/i }),
  ).toBeVisible();
  await expect(page.getByText("Destaque", { exact: true })).toBeVisible();
  await expect(page.getByText(/Semana no Pérola/i)).toBeVisible();
  await expect(page.getByText(/publicado|rascunho/i)).toHaveCount(0);
  await expect(page.getByText(/Quinta Acústica/i)).toHaveCount(0);
});

test("event posters and detail object-contain", async ({ page }) => {
  await page.goto("/demo/eventos");
  await expect(page.getByRole("heading", { name: /Eventos/i })).toBeVisible();
  await page.goto("/demo/eventos/noite-do-piseiro");
  await expect(
    page.getByRole("heading", { level: 1, name: /Noite do Piseiro/i }),
  ).toBeVisible();
  await expect(page.getByAltText(/Arte completa/i)).toBeVisible();
});

test("mobile sticky reserve on home", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/demo");
  await expect(
    page.locator(".fixed.inset-x-0.bottom-0").getByRole("link", {
      name: /Reservar/i,
    }),
  ).toBeVisible();
});

test("reduced motion home still works", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/demo");
  await expect(
    page.getByRole("heading", { name: /Música, gastronomia/i }),
  ).toBeVisible();
});

test("legado home remains accessible", async ({ page }) => {
  await page.goto("/demo/legado");
  await expect(page.getByText(/Versão legada/i)).toBeVisible();
});
