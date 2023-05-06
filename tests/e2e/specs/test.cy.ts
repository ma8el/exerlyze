describe('Page test', () => {
  it('Visits home page', () => {
    cy.visit('/tabs/home')
    cy.contains('ion-content', 'Home page')
  })

  it('Visits workouts page', () => {
    cy.visit('/tabs/workouts')
    cy.contains('ion-content', 'Workouts page')
  })

  it('Visits track page', () => {
    cy.visit('/tabs/track')
    cy.contains('ion-content', 'Track page')
  })

  it('Visits nutrition page', () => {
    cy.visit('/tabs/nutrition')
    cy.contains('ion-content', 'Nutrition page')
  })

  it('Visits you page', () => {
    cy.visit('/tabs/you')
    cy.contains('ion-content', 'You page')
  })
})
