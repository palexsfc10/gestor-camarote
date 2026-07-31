import { test, expect } from "@playwright/test";

async function completeWizardToSubmit(page: import("@playwright/test").Page) {
  await page.goto("/demo/reservar/pagode-do-piska");
  await expect(
    page.getByRole("heading", { name: "Solicitar reserva" }),
  ).toBeVisible();

  await page.getByRole("button", { name: /Aniversário/ }).click();
  await expect(page.getByText(/Etapa 2/)).toBeVisible();

  await expect(page.getByText("Camarote 07").first()).toBeVisible();
  await page.getByTestId("wizard-next").click();
  await expect(page.getByText(/Etapa 3/)).toBeVisible();

  await page.getByTestId("wizard-next").click();
  await expect(page.getByText(/Etapa 4/)).toBeVisible();

  await page.getByTestId("wizard-next").click();
  await expect(page.getByText(/Etapa 5/)).toBeVisible();

  await page.getByTestId("wizard-next").click();
  await expect(page.getByText(/Etapa 6/)).toBeVisible();

  await page.getByTestId("wizard-submit").click();
  await expect(page).toHaveURL(/\/demo\/reserva\/PROTO-007/);
}

test("public home and admin today navigate", async ({ page }) => {
  await page.goto("/demo");
  await expect(
    page.getByRole("heading", { name: /Música, gastronomia e experiências/i }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Painel da casa" }).click();
  await expect(page.getByText("Visão de hoje")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Pagode do Piska/i }),
  ).toBeVisible();
});

test("full demo journey: C07 free → request → confirm → prep → tracking", async ({
  page,
}) => {
  test.setTimeout(60000);

  await page.goto("/demo/admin/mapa");
  await expect(
    page.getByRole("button", { name: "Camarote 07, Livre" }),
  ).toBeVisible();

  await completeWizardToSubmit(page);
  await expect(
    page.getByText(
      "Aguardando análise da casa. Sua reserva ainda não está confirmada.",
    ),
  ).toBeVisible();

  await page.getByRole("link", { name: "Painel da casa", exact: true }).click();
  await expect(page.getByText("Visão de hoje")).toBeVisible();
  await expect(page.getByText("Mariana Alves")).toBeVisible();

  await page.getByRole("link", { name: "Analisar Mariana" }).click();
  await expect(
    page.getByRole("heading", { name: "Mariana Alves" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Confirmar", exact: true }).click();
  await page.getByRole("button", { name: "Confirmar reserva" }).click();
  await expect(page.getByText(/Reserva confirmada/i).first()).toBeVisible();

  await page.goto("/demo/admin/mapa");
  await expect(
    page.getByRole("button", { name: "Camarote 07, OK" }),
  ).toBeVisible();

  await page.goto("/demo/admin/preparacao");
  await expect(page.getByText(/Combo Neon/).first()).toBeVisible();
  await expect(page.getByText(/Mariana Alves/).first()).toBeVisible();
  await expect(
    page.getByText(/1× Pacote Aniversário/).first(),
  ).toBeVisible();

  await page.goto("/demo/reserva/PROTO-007");
  await expect(
    page.getByRole("heading", { name: /Reserva confirmada pela casa/i }),
  ).toBeVisible();
});

test("reset demo restores C07 available", async ({ page }) => {
  test.setTimeout(60000);
  page.on("dialog", (dialog) => dialog.accept());

  await completeWizardToSubmit(page);

  await page.getByRole("button", { name: "Reiniciar demonstração" }).click();
  await expect(page.getByText(/Demonstração reiniciada/i)).toBeVisible();

  await page.goto("/demo/admin/mapa");
  await expect(
    page.getByRole("button", { name: "Camarote 07, Livre" }),
  ).toBeVisible();
  await page.goto("/demo/admin/reservas?filtro=novas");
  await expect(page.getByText("Mariana Alves")).toHaveCount(0);
});
