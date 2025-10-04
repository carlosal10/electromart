import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import App from "../App";

const mockResponse = (data) =>
  Promise.resolve({
    json: () => Promise.resolve(data),
  });

describe("App smoke test", () => {
  const originalFetch = global.fetch;

  beforeAll(() => {
    global.fetch = jest.fn((url) => {
      if (url.includes("/api/hero")) return mockResponse([]);
      if (url.includes("/api/categories")) return mockResponse([]);
      if (url.includes("/api/products")) return mockResponse([]);
      return mockResponse({});
    });
  });

  afterEach(() => {
    global.fetch.mockClear();
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

    expect(await screen.findByText(/Electromart/i)).toBeInTheDocument();
  });
});
