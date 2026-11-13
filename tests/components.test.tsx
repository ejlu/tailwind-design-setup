import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Button, Field, FieldControl, Input, ThemeScope, cn } from "../src";
import { SettingsExample } from "../examples/settings";
import { ResourcesExample } from "../examples/resource-table";

describe("form contracts", () => {
  it("associates labels, guidance and validation with the actual control", () => {
    render(
      <Field label="Email" description="Used for receipts" error="Enter a valid email">
        <FieldControl>
          <Input />
        </FieldControl>
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Used for receipts Enter a valid email");
  });
  it("loading buttons retain their name, block submission, and default to button type", () => {
    render(<Button loading>Save changes</Button>);
    const button = screen.getByRole("button", { name: "Save changes" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("aria-busy", "true");
  });
  it("shows validation and then a successful local save", async () => {
    const user = userEvent.setup();
    render(
      <ThemeScope>
        <SettingsExample />
      </ThemeScope>,
    );
    const email = screen.getByRole("textbox", { name: "Contact email" });
    await user.clear(email);
    await user.paste("invalid");
    await user.click(screen.getByRole("button", { name: "Save changes" }));
    expect(email).toHaveAccessibleDescription(
      "For account updates and billing receipts. Enter a valid email address.",
    );
    await user.clear(email);
    await user.paste("person@example.com");
    await user.click(screen.getByRole("button", { name: "Save changes" }));
    expect(screen.getByRole("status")).toHaveTextContent("Workspace changes saved");
    expect(email).not.toHaveAttribute("aria-invalid");
  });
});

it("keeps filtered selection independent of hidden rows and supports empty-state recovery", async () => {
  const user = userEvent.setup();
  render(
    <ThemeScope>
      <ResourcesExample />
    </ThemeScope>,
  );
  await user.click(screen.getByRole("checkbox", { name: "Select Brand foundations" }));
  const search = screen.getByRole("textbox", { name: "Search resources" });
  await user.click(search);
  await user.paste("Playbook");
  await user.click(screen.getByRole("checkbox", { name: "Select all visible resources" }));
  expect(screen.getByRole("status")).toHaveTextContent("2 selected");
  await user.clear(search);
  await user.paste("no match");
  expect(screen.getByText("No resources found")).toBeVisible();
  await user.click(screen.getByRole("button", { name: "Clear search" }));
  expect(screen.getByRole("checkbox", { name: "Select Brand foundations" })).toBeChecked();
  expect(screen.getByRole("checkbox", { name: "Select Member onboarding" })).toBeChecked();
});

it("class overrides understand custom spacing, shape, shadow and type groups", () => {
  expect(cn("px-control-px", "p-0")).toBe("p-0");
  expect(cn("min-h-control", "min-h-8")).toBe("min-h-8");
  expect(cn("size-control", "size-8")).toBe("size-8");
  expect(cn("gap-control-gap", "gap-2")).toBe("gap-2");
  expect(cn("rounded-panel", "rounded-none")).toBe("rounded-none");
  expect(cn("shadow-raised", "shadow-none")).toBe("shadow-none");
  expect(cn("type-body", "type-label")).toBe("type-label");
  expect(cn("type-body", "text-muted")).toBe("type-body text-muted");
});

it("Field preserves extra descriptions while keeping its own error association", () => {
  render(
    <>
      <p id="external-help">Additional guidance.</p>
      <Field label="Name" error="Required.">
        <FieldControl>
          <Input aria-describedby="external-help" />
        </FieldControl>
      </Field>
    </>,
  );
  expect(screen.getByRole("textbox", { name: "Name" })).toHaveAccessibleDescription(
    "Additional guidance. Required.",
  );
});
