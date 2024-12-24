describe("header test on default shops page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
  });

  it("displays an h1 element in the navigation bar", () => {
    cy.getByData("nav-heading")
      .should("be.visible")
      .and("contain", "Exile's Emporium");
  });
});
