import { expect, test } from "@playwright/test";

test("create profile form", async ({ page }) => {
  await page.goto("http://localhost:3000/form");

  const formLocator = page.locator("form");

  const usernameContainer = formLocator.locator("div").filter({
    has: page.getByLabel("username"),
  });

  await expect(usernameContainer).toBeVisible();

  const usernameContainerMinCharErrorLocator = usernameContainer.getByText(
    "String must contain at least 2 character(s)"
  );

  await expect(usernameContainerMinCharErrorLocator).not.toBeVisible();

  const descriptionLocator = usernameContainer.getByText(
    "This is your public display name."
  );

  await expect(descriptionLocator).toBeVisible();

  // Checkbox

  const interestsContainer = formLocator
    .locator("div")
    .filter({
      has: page.getByRole("checkbox"),
    })
    .filter({
      has: page.getByText("Interests"),
    });

  await expect(interestsContainer).toBeVisible();

  // 1. 3 options are presented
  // 2. 3 options are what we want them to be
  // 3. Option must be selectable
  // 4. Multiple options can be selectable at the same time
  // 5. Option must be unselectable
  // 6. Clicking on the label should toggle the checkbox
  // 7. Clicking on the button should toggle the checkbox

  const LabelOptions = interestsContainer.locator("label").filter({
    hasNotText: "Interests",
  });

  await expect(LabelOptions).toHaveCount(3);

  const interestItems = ["Books", "Movies", "Music"];

  for (const interest of await LabelOptions.all()) {
    const interestText = await interest.textContent();

    expect(interestItems).toContain(interestText);
  }

  // const buttonOptions = interestsContainer.locator("button").filter({
  //   has: page.getByRole("checkbox"),
  // });

  const buttonOptions = interestsContainer
    .getByRole("checkbox")
    .and(page.locator("button"));

  await expect(buttonOptions).toHaveCount(3);

  const firstLabel = LabelOptions.first();

  await expect(firstLabel).toBeChecked();

  await firstLabel.uncheck();

  await expect(firstLabel).not.toBeChecked();

  await firstLabel.check();

  await expect(firstLabel).toBeChecked();

  const secondLabel = LabelOptions.nth(1);

  await expect(secondLabel).not.toBeChecked();

  await secondLabel.check();

  await expect(secondLabel).toBeChecked();
  await expect(firstLabel).toBeChecked();

  const lastLabel = LabelOptions.last();

  await expect(lastLabel).not.toBeChecked();

  const firstBtnOption = buttonOptions.first();

  await expect(firstBtnOption).toBeChecked();

  await firstBtnOption.click();

  await expect(firstBtnOption).not.toBeChecked();

  await firstBtnOption.click();

  await expect(firstBtnOption).toBeChecked();

  await secondLabel.uncheck();

  await expect(secondLabel).not.toBeChecked();

  for (const item of await buttonOptions.all()) {
    const isChecked = await item.isChecked();

    if (!isChecked) {
      await item.check();
    }

    await expect(item).toBeChecked();
  }

  // Radio Button

  const notificationContainer = formLocator
    .locator("div")
    .filter({
      has: page.getByRole("radio"),
    })
    .filter({
      has: page.getByText("Notify me about..."),
    });

  await expect(notificationContainer).toBeVisible();

  const radioOpts = notificationContainer.getByRole("radio");

  await expect(radioOpts).toHaveCount(3);

  const option1 = radioOpts.first();

  const option2 = radioOpts.nth(1);

  const option3 = radioOpts.last();

  await option1.click();

  await expect(option1).toBeChecked();
  await expect(option2).not.toBeChecked();
  await expect(option3).not.toBeChecked();

  await option2.click();

  await expect(option1).not.toBeChecked();
  await expect(option2).toBeChecked();
  await expect(option3).not.toBeChecked();

  await option3.click();

  await expect(option1).not.toBeChecked();
  await expect(option2).not.toBeChecked();
  await expect(option3).toBeChecked();

  // Dropdown Menu

  const dropdownContainer = formLocator.locator(page.getByRole("combobox")); // ≠combobox, = div parent of combobox

  await expect(dropdownContainer).toBeVisible();

  const initialMsg = formLocator.locator("div").locator("span").filter({
    hasText: "Select a verified email to display",
  });

  await expect(initialMsg).toHaveText("Select a verified email to display");

  await dropdownContainer.click();

  const dropdownMenu = page.locator("select");

  console.log(dropdownMenu);

  await expect(dropdownContainer).toHaveText("India");
  // await expect(dropdownMenu).toHaveText("Select a verified email to display"); //--- Not Working

  // Click Submit button

  const submitBtn = formLocator.getByRole("button", {
    name: "Submit",
  });

  await submitBtn.click();

  await expect(usernameContainerMinCharErrorLocator).toBeVisible();

  const usernameLabel = usernameContainer.getByLabel("Username");

  await expect(usernameLabel).toBeVisible();

  await usernameLabel.pressSequentially("One Piece");

  await expect(usernameLabel).toHaveValue("One Piece");

  await expect(usernameContainerMinCharErrorLocator).not.toBeVisible();
});
