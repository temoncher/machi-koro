import { testId } from '../support/app.po';

describe('web-client', () => {
  beforeEach(() => cy.visit('http://localhost:4200/'));

  it('should greet the server', () => {
    cy.get(testId('connect_button'))
      .should('contain.text', 'CONNECT')
      .click();

    cy.get(testId('greet_button'))
      .should('contain.text', 'Greet')
      .click();
  });
});
