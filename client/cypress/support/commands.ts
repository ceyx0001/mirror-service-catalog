Cypress.Commands.add("getByData", (dataTestAttribute: string) => {
  return cy.get(`[data-test=${dataTestAttribute}]`);
});

Cypress.Commands.add(
  "findByData",
  { prevSubject: "element" },
  (subject, dataTestAttribute) => {
    return cy.wrap(subject).find(`[data-test=${dataTestAttribute}]`);
  }
);
