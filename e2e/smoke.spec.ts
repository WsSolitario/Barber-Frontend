import { expect, test } from "@playwright/test";

test("landing page renders its primary content", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: /agendar cita/i })).toBeVisible();
});

test("login page renders the administrative sign-in form", async ({ page }) => {
  await page.goto("/auth/login");

  await expect(page.getByRole("heading", { name: /acceso administrativo/i })).toBeVisible();
  await expect(page.getByPlaceholder("Correo")).toBeVisible();
  await expect(page.getByPlaceholder("Contrasena")).toBeVisible();
  await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();
});

test("booking page renders the public booking form", async ({ page }) => {
  await page.goto("/booking");

  await expect(page.getByRole("heading", { name: /agenda tu cita/i })).toBeVisible();
  await expect(page.getByLabel("Sucursal")).toBeVisible();
  await expect(page.getByLabel("Fecha y hora")).toBeVisible();
});

for (const [path, heading] of [
  ["/admin", "Panel administrativo"],
  ["/admin/calendar", "Calendario"],
  ["/admin/settings", "Configuracion"],
  ["/admin/users", "Equipo"],
] as const) {
  test(`admin route ${path} renders its signed-out state`, async ({ page }) => {
    await page.goto(path);

    await expect(page.getByRole("link", { name: "BARBER OS Panel administrativo" })).toBeVisible();
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    await expect(page.getByRole("link", { name: /inicia sesion/i })).toBeVisible();
  });
}

test("admin shell links to all administrative areas", async ({ page }) => {
  await page.goto("/admin");

  for (const name of ["Resumen", "Calendario", "Reportes", "Equipo", "Configuracion"]) {
    await expect(page.getByRole("link", { name })).toBeVisible();
  }
});
