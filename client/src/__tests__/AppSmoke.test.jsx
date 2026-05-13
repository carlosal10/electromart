import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import App from "../App";

const mockResponse = (data) =>
  Promise.resolve({
    ok: true,
    status: 200,
    headers: {
      get: () => "application/json",
    },
    json: () => Promise.resolve(data),
  });

describe("App smoke test", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn((input) => {
      const url = String(input?.url || input || "");

      if (url.includes("/api/hero")) return mockResponse([]);
      if (url.includes("/api/categories")) return mockResponse([]);
      if (url.includes("/api/products")) return mockResponse([]);
      return mockResponse({});
    });
  });

  afterEach(() => {
    global.fetch.mockReset();
  });

  afterAll(() => {
    if (originalFetch) {
      global.fetch = originalFetch;
    } else {
      delete global.fetch;
    }
  });

  it("renders the storefront shell", async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText(/^Electromart$/i, { selector: ".logo" })).toBeInTheDocument();
  });
});
