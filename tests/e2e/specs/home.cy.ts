describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/tabs/home');
  });

  it('should load the home page', () => {
    cy.url().should('include', '/tabs/home');
  });
});