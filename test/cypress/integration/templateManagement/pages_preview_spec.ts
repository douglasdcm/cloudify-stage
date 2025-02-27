describe('Page preview', () => {
    before(() => {
        cy.activate('valid_trial_license');
        cy.intercept('/console/appData/templates/pages/adminDash.json', { fixture: 'pages/page_with_tabs' });
        cy.mockLogin();
    });

    it('should allow to switch tabs and maximize widgets', () => {
        cy.get('.loader').should('be.not.visible');

        cy.goToTemplateManagement();

        cy.get('.segment:contains(Pages) .search:eq(0)').click();

        // Verify tabs switching works
        cy.contains('Tab2').click();
        cy.contains('.widgetName', 'Cluster Status').should('not.exist');
        cy.contains('.widgetName', 'Blueprints').should('not.exist');
        cy.get('.deploymentNumWidget');

        cy.contains('Tab1').click();

        // Verify widget maximize button works for widgets inside tabs
        cy.get('.blueprintsWidget .expand').click({ force: true });

        cy.contains('.widgetName', 'Cluster Status').should('not.be.visible');
        cy.contains('.widgetName', 'Catalog').should('not.be.visible');
        cy.get('.blueprintNumWidget').should('not.be.visible');

        // Verify widget collapse button works
        cy.get('.blueprintsWidget .compress').click({ force: true });
        cy.contains('.widgetName', 'Cluster Status').should('be.visible');
        cy.contains('.widgetName', 'Cluster Status').should('be.visible');
        cy.contains('Tab1').should('be.visible');
        cy.contains('Tab2').should('be.visible');
    });
});
