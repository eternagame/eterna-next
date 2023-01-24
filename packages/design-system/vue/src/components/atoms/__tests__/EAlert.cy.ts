import EAlert from '../EAlert.vue';

describe('EAlert', () => {
  it('Click dismisses alert', () => {
    cy.mount(EAlert, {
      props: {
        message: 'This message can be dismissed',
        color: 'success',
        size: 'md',
        dismissible: true,
      },
    });
    cy.get('.dismiss').click();
    cy.get('.alert').should('not.be.visible');
  });
  it('Alert has icon', () => {
    cy.mount(EAlert, {
      props: {
        message: 'Hello World',
        color: 'info',
        size: 'md',
        dismissible: true,
      },
      slots: {
        icon: () => 'Icon',
      },
    });
    cy.get('.alert').should('have.class', '-with-icon');
  });
  it('Informational State', () => {
    cy.mount(EAlert, {
      props: {
        message: 'Hello World',
        color: 'info',
        size: 'md',
        dismissible: true,
      },
    });
    cy.get('.alert').should('have.class', '-info');
  });
  it('Success State', () => {
    cy.mount(EAlert, {
      props: {
        message: 'Solution submitted!',
        color: 'success',
        size: 'md',
        dismissible: true,
      },
    });
    cy.get('.alert').should('have.class', '-success');
  });
  it('Warning State', () => {
    cy.mount(EAlert, {
      props: {
        message: 'This may be a problem',
        color: 'warning',
        size: 'md',
        dismissible: true,
      },
    });
    cy.get('.alert').should('have.class', '-warning');
  });
  it('Error State', () => {
    cy.mount(EAlert, {
      props: {
        message: 'Something went wrong: Error code 42',
        color: 'danger',
        size: 'md',
        dismissible: true,
      },
    });
    cy.get('.alert').should('have.class', '-danger');
  });
  it('playground', () => {
    cy.mount(EAlert, {
      props: {
        message: 'Hello World',
        color: 'info',
        size: 'md',
        dismissible: true,
      },
      slots: {
        icon: () => 'Hi',
      },
    });
  });
});
