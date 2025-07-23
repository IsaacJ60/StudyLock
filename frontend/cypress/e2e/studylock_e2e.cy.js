describe('StudyLock E2E Flow', () => {
  it('should lock in, add a task, move it, delete it, and show score changes', () => {
    // go to home page
    cy.visit('http://localhost:19006');

    // Check initial score
    cy.contains(/Score:/i).invoke('text').then((scoreText1) => {
      const initialScore = parseInt(scoreText1.replace(/\D/g, ''));

      // Click the FOCUS button to start camera
      cy.contains('FOCUS').click();
      cy.contains('STOP').should('exist');

      // Wait for a possible score update 
      cy.wait(2500);
      cy.contains(/Score:/i).invoke('text').then((scoreText2) => {
        const newScore = parseInt(scoreText2.replace(/\D/g, ''));
        expect(newScore).to.be.at.least(initialScore); // Score should not decrease
      });
    });

    // goes to the explore/tasks page
    cy.contains(/explore/i).click();

    // Add a new task
    cy.get('input[placeholder="Add a task"]').first().type('E2E Test Task{enter}');
    cy.contains('E2E Test Task').should('exist');

    //moving to in-progress
    cy.contains('E2E Test Task').parent().find('button, [role="button"]').first().click();
    cy.get('[name="checkmark"]').first().click();
    cy.get('.column').eq(1).contains('E2E Test Task').should('exist');

  //in porgress 
    cy.get('.column').eq(1).contains('E2E Test Task').parent().find('button, [role="button"]').first().click();
    cy.get('[name="checkmark"]').first().click();
    cy.get('.column').eq(2).contains('E2E Test Task').should('exist');

    // done
    cy.get('.column').eq(2).contains('E2E Test Task').parent().find('button, [role="button"]').first().click();
    cy.get('[name="trash"]').first().click();
    cy.contains('E2E Test Task').should('not.exist');

    // go to the profile page
    cy.contains(/profile/i).click();
    cy.contains(/Score:/i).should('exist');
  });
}); 