import { test, expect } from "@playwright/test";

const concepts = [
  { path: "/demo/conceitos/a", name: "Cinematic Night" },
  { path: "/demo/conceitos/b", name: "Editorial Premium" },
  { path: "/demo/conceitos/c", name: "Urban Live" },
] as const;

for (const concept of concepts) {
  test(`smoke ${concept.path}`, async ({ page }) => {
    await page.goto(concept.path);
    await expect(
      page.getByRole("heading", { level: 1, name: /Pagode do Piska/i }),
    ).toBeVisible();
    await expect(page.getByText(/2 camarotes disponíveis/i).first()).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Reservar agora/i }).first(),
    ).toBeVisible();
    await expect(page.getByText(concept.name).first()).toBeVisible();
    await expect(page.getByText(/publicado|rascunho/i)).toHaveCount(0);
    await expect(page.getByText(/Quinta Acústica/i)).toHaveCount(0);
  });
}

test("concepts hub lists three directions", async ({ page }) => {
  await page.goto("/demo/conceitos");
  await expect(page.getByRole("link", { name: /Cinematic Night/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Editorial Premium/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Urban Live/i })).toBeVisible();
});

test("public home hides drafts and admin status badges", async ({ page }) => {
  await page.goto("/demo");
  await expect(page.getByText(/Quinta Acústica/i)).toHaveCount(0);
  await expect(page.getByText(/^rascunho$/i)).toHaveCount(0);
  await expect(page.getByText(/^publicado$/i)).toHaveCount(0);
});

test("mobile viewport shows sticky reserve on concept A", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/demo/conceitos/a");
  const sticky = page.locator(".fixed.inset-x-0.bottom-0").getByRole("link", {
    name: /Reservar/i,
  });
  await expect(sticky).toBeVisible();
});

test("reduced motion still renders concept C", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/demo/conceitos/c");
  await expect(
    page.getByRole("heading", { level: 1, name: /Pagode do Piska/i }),
  ).toBeVisible();
  await expect(page.getByText(/Ao vivo/i).first()).toBeVisible();
});
