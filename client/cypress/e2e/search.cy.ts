describe("search test against api", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
  });

  const baseFilterTestVal = "bow";

  it("should create a new base filter", () => {
    cy.getByData("base-filters").findByData("add-filter-button").click();
    cy.getByData("search-filter").should("have.length", 1);
    cy.getByData("search-filter").type(baseFilterTestVal);
    cy.getByData("search-filter").should("have.value", baseFilterTestVal);
    cy.getByData("search-button").click();
  });
});
