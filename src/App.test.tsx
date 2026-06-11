import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders MatchPilot shell", () => {
    render(<App />);

    expect(screen.getByText("MatchPilot")).toBeInTheDocument();
    expect(screen.getByText("计划")).toBeInTheDocument();
    expect(screen.getByText("Ask AI")).toBeInTheDocument();
  });
});
