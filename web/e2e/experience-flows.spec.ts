import { test, expect } from "@playwright/test";

async function goToWizard(page: import("@playwright/test").Page) {
  await page.goto("/demo/reservar/pagode-do-piska");
  await expect(
    page.getByRole("heading", { name: "Solicitar reserva" }),
  ).toBeVisible();
}

async function advanceToReview(page: import("@playwright/test").Page) {
  for (let i = 0; i < 4; i++) {
    await page.getByTestId("wizard-next").click();
  }
  await expect(page.getByText(/Etapa 6/)).toBeVisible();
}

test("selecting Mesa shows only tables", async ({ page }) => {
  await goToWizard(page);
  await page.getByTestId("experience-mesa").click();
  await expect(page.getByText(/Etapa 2/)).toBeVisible();
  await expect(page.getByText("Mesa 02").first()).toBeVisible();
  await expect(page.getByText("Camarote 07")).toHaveCount(0);
  await expect(page.getByText("Camarote 01")).toHaveCount(0);
});

test("selecting Camarote shows only booths", async ({ page }) => {
  await goToWizard(page);
  await page.getByTestId("experience-camarote").click();
  await expect(page.getByText(/Etapa 2/)).toBeVisible();
  await expect(page.getByText("Camarote 07").first()).toBeVisible();
  await expect(page.getByText("Mesa 01")).toHaveCount(0);
  await expect(page.getByText("Mesa 02")).toHaveCount(0);
});

test("mesa review preserves experience type", async ({ page }) => {
  await goToWizard(page);
  await page.getByTestId("experience-mesa").click();
  await page.getByRole("button", { name: /Mesa 02/ }).click();
  await advanceToReview(page);
  await expect(page.getByTestId("review-experience")).toHaveText(
    /Experiência: Mesa/,
  );
  await expect(page.getByTestId("review-space")).toHaveText(/Mesa 02/);
});

test("camarote review preserves experience type", async ({ page }) => {
  await goToWizard(page);
  await page.getByTestId("experience-camarote").click();
  await expect(page.getByText("Camarote 07").first()).toBeVisible();
  await advanceToReview(page);
  await expect(page.getByTestId("review-experience")).toHaveText(
    /Experiência: Camarote/,
  );
  await expect(page.getByTestId("review-space")).toHaveText(/Camarote 07/);
});

test("public CTA block is removed from home", async ({ page }) => {
  await page.goto("/demo");
  await expect(page.getByText("Sua mesa ou camarote te espera")).toHaveCount(0);
  await expect(page.getByText("Reserve sua noite")).toHaveCount(0);
});

test("switching event clears operational data", async ({ page }) => {
  await page.goto("/demo/admin/reservas");
  await expect(page.getByText("Carlos Mendes").first()).toBeVisible();
  await expect(page.getByText("Patrícia Nunes").first()).toBeVisible();

  await page.goto("/demo/admin");
  await page.getByTestId("event-switcher").selectOption({ label: "Sábado Livre" });
  await expect(page.getByRole("heading", { name: /Sábado Livre/i })).toBeVisible();

  await page.goto("/demo/admin/reservas");
  await expect(
    page.getByText("Nenhuma reserva para este evento ainda."),
  ).toBeVisible();
  await expect(page.getByText("Carlos Mendes")).toHaveCount(0);

  await page.goto("/demo/admin/preparacao");
  await expect(
    page.getByText("Nenhuma preparação para este evento ainda."),
  ).toBeVisible();

  await page.goto("/demo/admin/cardapio");
  await expect(page.getByText("Balde Premium").first()).toBeVisible();

  await page.goto("/demo/admin");
  await page
    .getByTestId("event-switcher")
    .selectOption({ label: "Pagode do Piska" });
  await page.goto("/demo/admin/reservas");
  await expect(page.getByText("Carlos Mendes").first()).toBeVisible();
});
