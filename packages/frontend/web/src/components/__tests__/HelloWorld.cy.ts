import HelloWorld from '../HelloWorld.vue';

describe('HelloWorld', () => {
  it('playground', () => {
    cy.mount(HelloWorld, { props: { message: 'Hello Cypress' } });
  });

  it('renders properly', () => {
    cy.mount(HelloWorld, { props: { message: 'Hello Cypress' } });
    cy.get('h1').should('contain', 'Hello Cypress');
  });
});
