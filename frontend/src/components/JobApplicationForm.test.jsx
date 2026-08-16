import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import JobApplicationForm from "./JobApplicationForm";

describe("JobApplicationForm", () => {
  // TEST 1: Form apne sab fields ke saath render ho raha hai
  it("renders all form fields and the submit button", () => {
    render(<JobApplicationForm />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/experience level/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /submit application/i })
    ).toBeInTheDocument();
  });

  // TEST 2: User field mein type kar sakta hai aur value update hoti hai
  it("allows user to type into the full name and email testfields", async () => {
    const user = userEvent.setup();
    render(<JobApplicationForm />);

    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);

    await user.type(nameInput, "Arooj Mehmood");
    await user.type(emailInput, "arooj@example.com");

    expect(nameInput).toHaveValue("Arooj Mehmood");
    expect(emailInput).toHaveValue("arooj@example.com");
  });

  // TEST 3: Invalid email format submit karne par sahi validation error dikhna chahiye
  it("shows a validation error for an invalid email on submit", async () => {
    const user = userEvent.setup();
    render(<JobApplicationForm />);

    await user.type(screen.getByLabelText(/full name/i), "Arooj Mehmood");
    await user.type(screen.getByLabelText(/email address/i), "not-an-email");
    await user.type(screen.getByLabelText(/phone number/i), "03001234567");

    await user.click(
      screen.getByRole("button", { name: /submit application/i })
    );

    expect(
      await screen.findByText(/please enter a valid email address/i)
    ).toBeInTheDocument();
  });

  // TEST 4: Sab fields khali chor kar submit karo => required field errors dikhne chahiye
  it("shows required field errors when submitting an empty form", async () => {
    const user = userEvent.setup();
    render(<JobApplicationForm />);

    await user.click(
      screen.getByRole("button", { name: /submit application/i })
    );

    expect(
      await screen.findByText(/full name must be at least 3 characters/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
  });

  // TEST 5: Invalid file type select karne par FileUploadBox error dikhata hai
  it("rejects an invalid file type on selection", async () => {
    const { container } = render(<JobApplicationForm />);

    const fileInput = container.querySelector('input[type="file"]');

    const invalidFile = new File(["dummy content"], "notes.txt", {
      type: "text/plain",
    });

    
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    expect(
      await screen.findByText(/only jpg, png, and pdf files are allowed/i)
    ).toBeInTheDocument();
  });

});