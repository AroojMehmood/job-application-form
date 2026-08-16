const { test, expect } = require("@playwright/test");

test("user can fill and submit the job application form successfully", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel(/full name/i).fill("Arooj Mehmood");
  await page.getByLabel(/email address/i).fill("arooj.e2e@example.com");
  await page.getByLabel(/phone number/i).fill("03001234567");
  await page.getByLabel(/date of birth/i).fill("2000-01-01");
  await page.getByLabel(/gender/i).selectOption("Female");
  await page.getByLabel(/experience level/i).selectOption("Fresher");

  // File input hidden hai (drag-drop UI hai), setInputFiles bilkul kaam karta hai visibility ke bina
  await page
    .locator('input[type="file"]')
    .setInputFiles({
      name: "resume.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("dummy pdf content for e2e test"),
    });

  await page.getByRole("button", { name: /submit application/i }).click();

  await expect(
    page.getByText(/application submitted successfully/i)
  ).toBeVisible({ timeout: 10000 });
});