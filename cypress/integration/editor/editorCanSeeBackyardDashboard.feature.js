describe('Backyard article dashboard can display articles', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  describe('Successfully as an editor', () => {
    beforeEach(() => {
      cy.intercept('GET', 'https://fakest-newzz.herokuapp.com/api/articles', {
        fixture: 'listOfBackyardArticles.json',
      });
      cy.window()
        .its('store')
        .invoke('dispatch', {
          type: 'LOG_IN',
          payload: { fullName: 'Mr. Editor', role: 'editor' },
        });
      cy.get('[data-cy=backyard-menu-btn]').click();
    });

    it('is expected to display a list of 6 backyard articles', () => {
      cy.get('[data-cy=article-row]').should('have.lengty', 6);
    });

    it('is expected to display details of each article', () => {
      cy.get('[data-cy=article-row]')
        .first()
        .within(() => {
          cy.get('[data-cy=title]').should('contain', 'Something');
          cy.get('[data-cy=theme]').should('contain', 'My cat is spying on me');
          cy.get('[data-cy=written-by]').should('contain', 'Bob Kramer');
          cy.get('[data-cy=date]').should('contain', '2021-05-19, 15:10');
          cy.get('[data-cy=country]').should('contain', 'Denmark');
        });
    });
  });

  describe('Unsuccessfully with no articles', () => {
    beforeEach(() => {
      cy.intercept('GET', 'https://fakest-newzz.herokuapp.com/api/articles', {
        backyard_articles: [],
      });
      cy.window()
        .its('store')
        .invoke('dispatch', {
          type: 'LOG_IN',
          payload: { fullName: 'Mr. Editor', role: 'editor' },
        });
      cy.get('[data-cy=backyard-menu-btn]').click();
    });

    it('is expected to display a message', () => {
      cy.get('[data-cy=no-articles-message]').should(
        'contain',
        'There are no backyard articles yet'
      );
    });
  });

  describe('Unsuccessfully as a journalist'),
    () => {
      beforeEach(() => {
        cy.intercept('GET', 'https://fakest-newzz.herokuapp.com/api/articles', {
          statusCode: 401,
        });
        cy.window()
          .its('store')
          .invoke('dispatch', {
            type: 'LOG_IN',
            payload: { fullName: 'Mr. Journalist', role: 'journalist' },
          });
      });

      it('is expected not to see any menu button', () => {
        cy.get('[data-cy=backyard-menu-btn]').should('not.be.visible');
      });

      it('is expected to be redirected', () => {
        cy.get('[data-cy=backyard-menu-btn]').should('not.be.visible');
        cy.visit('/overview');
        cy.url().should('contain', '/dashboard');
      });
    };
});
