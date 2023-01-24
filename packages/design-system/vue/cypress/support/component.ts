// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Import global styles
import '@/assets/style.css';

// eslint-plugin-import has a false positive here
// eslint-disable-next-line import/no-extraneous-dependencies
import { mount } from 'cypress/vue';
import { h } from 'vue';
import ActionBar from './ActionBar.vue';

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}

// Use this to mount without ActionBar wrapper component
// Cypress.Commands.add('mount', mount);

// Augment mount command with an ActionBar wrapper component
// The ActionBar is where we place app-level settings like theme
Cypress.Commands.add('mount', (component, ...args) => mount(() => h(ActionBar, {}, () => h(component, args[0].props, args[0].slots)), ...args));

// Example use:
// cy.mount(MyComponent)
