import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import React from "react";
import { Modal } from "../src/components/floating/modal";
import { ComponentsProvider } from "../src/hooks/use-components-provider";

describe("Modal.confirm", () => {
  const TestApp = () => {
    const handleConfirm = async () => {
      const result = await Modal.confirm({
        title: "Confirm Action",
        description: "Are you sure you want to proceed?",
        confirm: { text: "Yes, do it" },
        cancel: { text: "No, stop" },
      });
      window.alert(result ? "Confirmed" : "Cancelled");
    };

    return (
      <ComponentsProvider>
        <button onClick={handleConfirm}>Open Confirm</button>
      </ComponentsProvider>
    );
  };

  it("should show the confirmation modal and resolve to true when confirmed", async () => {
    vi.spyOn(window, "alert").mockImplementation(() => {});
    render(<TestApp />);

    // Click the button to trigger Modal.confirm
    fireEvent.click(screen.getByText("Open Confirm"));

    // Check if modal is visible
    expect(screen.getByText("Confirm Action")).toBeInTheDocument();
    expect(screen.getByText("Are you sure you want to proceed?")).toBeInTheDocument();

    // Click "Yes, do it"
    fireEvent.click(screen.getByText("Yes, do it"));

    // Modal should be closed and alert called with "Confirmed"
    await waitFor(() => {
      expect(screen.queryByText("Confirm Action")).not.toBeInTheDocument();
    });
    expect(window.alert).toHaveBeenCalledWith("Confirmed");
  });

  it("should resolve to false when cancelled", async () => {
    vi.spyOn(window, "alert").mockImplementation(() => {});
    render(<TestApp />);

    fireEvent.click(screen.getByText("Open Confirm"));

    // Click "No, stop"
    fireEvent.click(screen.getByText("No, stop"));

    await waitFor(() => {
      expect(screen.queryByText("Confirm Action")).not.toBeInTheDocument();
    });
    expect(window.alert).toHaveBeenCalledWith("Cancelled");
  });
});
