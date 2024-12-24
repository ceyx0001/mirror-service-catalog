declare namespace Cypress {
  interface Chainable {
    getByData(dataTestAttribute: string): Chainable<JQuery<HTMLElement>>;
    findByData(dataTestAttribute: string): Chainable<JQuery<HTMLElement>>;
  }
}
