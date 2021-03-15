// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import 'cypress-file-upload';
import 'cypress-localstorage-commands';
import _ from 'lodash';
import type { RouteHandler, StringMatcher } from 'cypress/types/net-stubbing';

import './blueprints';
import './deployments';
import './executions';
import './users';
import './sites';
import './templates';
import './plugins';
import './editMode';
import './widgets';
import './secrets';
import './snapshots';
import { addCommands, GetCypressChainableFromCommands } from 'cloudify-ui-common/cypress/support';

let token = '';

const getCommonHeaders = () => ({
    'Authentication-Token': token,
    tenant: 'default_tenant'
});

declare global {
    namespace Cypress {
        // NOTE: necessary for extending the Cypress API
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export interface Chainable extends GetCypressChainableFromCommands<typeof commands> {}
    }
}

const commands = {
    waitUntilPageLoaded: () => {
        cy.log('Wait for widgets loaders to disappear');
        cy.get('div.loader:visible', { timeout: 10000 }).should('not.exist');
    },
    waitUntilLoaded: () => {
        cy.log('Wait for splash screen loader to disappear');
        cy.get('#loader', { timeout: 20000 }).should('be.not.visible');
        cy.waitUntilPageLoaded();
    },
    uploadLicense: (license: string) =>
        cy.fixture(`license/${license}.yaml`).then(yaml =>
            cy.request({
                method: 'PUT',
                url: '/console/sp',
                qs: {
                    su: '/license'
                },
                headers: {
                    Authorization: `Basic ${btoa('admin:admin')}`,
                    'Content-Type': 'text/plain'
                },
                body: yaml
            })
        ),
    activate: (license = 'valid_trial_license') =>
        cy
            .uploadLicense(license)
            .getAdminToken()
            .then(adminToken => {
                token = adminToken;
            })
            .then(() =>
                cy.stageRequest(`/console/ua/clear-pages?tenant=default_tenant`, 'GET', { failOnStatusCode: false })
            ),
    cfyRequest: (
        url: string,
        method = 'GET',
        headers: any = null,
        body: any = null,
        options: Partial<Cypress.RequestOptions> = {}
    ) =>
        cy.request({
            method,
            url: '/console/sp',
            qs: {
                su: url
            },
            headers: {
                'Content-Type': 'application/json',
                ...getCommonHeaders(),
                ...headers
            },
            body,
            ...options
        }),
    cfyFileRequest: (filePath: string, isBinaryFile: boolean, url: string, method = 'PUT', headers: any = null) => {
        const filePromise = isBinaryFile
            ? cy.fixture(filePath, 'binary').then(binary => Cypress.Blob.binaryStringToBlob(binary))
            : cy.fixture(filePath);

        return filePromise.then(fileContent =>
            cy.window().then(
                window =>
                    new Promise((resolve, reject) => {
                        const xhr = new window.XMLHttpRequest();
                        xhr.open(method, `/console/sp?su=${encodeURIComponent(url)}`);
                        xhr.onload = resolve;
                        xhr.onerror = reject;
                        Object.entries({ ...getCommonHeaders(), ...headers }).forEach(([name, value]) =>
                            xhr.setRequestHeader(name, value as string)
                        );
                        xhr.send(fileContent);
                    })
            )
        );
    },
    stageRequest: (url: string, method = 'GET', options?: Partial<Cypress.RequestOptions>, headers?: any) => {
        cy.request({
            method,
            url,
            headers: {
                'Content-Type': 'application/json',
                ...getCommonHeaders(),
                ...headers
            },
            ...options
        });
    },
    login: (username = 'admin', password = 'admin', expectSuccessfulLogin = true) => {
        cy.location('pathname').then(pathname => {
            if (pathname !== '/console/login') {
                cy.visit('/console/login');
            }
        });

        cy.get('.form > :nth-child(1) > .ui > input').clear().type(username);
        cy.get('.form > :nth-child(2) > .ui > input').clear().type(password);
        cy.get('.form > button').click();

        cy.get('.form > button.loading').should('not.exist');

        if (expectSuccessfulLogin) {
            cy.getCookies()
                .should('have.length', 1)
                .then(cookies => {
                    expect(cookies[0]).to.have.property('name', 'XSRF-TOKEN');
                });

            cy.waitUntilLoaded().then(() => cy.saveLocalStorage());
        }
    },
    mockLogin: (username = 'admin', password = 'admin') => {
        cy.stageRequest('/console/auth/login', 'POST', undefined, {
            Authorization: `Basic ${btoa(`${username}:${password}`)}`
        }).then(response => {
            const { role } = response.body;
            cy.setLocalStorage(
                `manager-state-main`,
                JSON.stringify({
                    auth: { role, groupSystemRoles: {}, tenantsRoles: {} },
                    username
                })
            );
        });
        cy.visit('/console').waitUntilLoaded();
    },
    visitPage: (name: string, id: string | null = null) => {
        cy.log(`Switching to '${name}' page`);
        cy.get('.sidebar.menu .pages').within(() => cy.contains(name).click({ force: true }));
        if (id) {
            cy.location('pathname').should('be.equal', `/console/page/${id}`);
        }
        cy.waitUntilPageLoaded();
    },
    usePageMock: (widgetIds?: string | string[], widgetConfiguration: any = {}) => {
        const widgetIdsArray = _.castArray(widgetIds);
        cy.intercept(
            'GET',
            '/console/widgets/list',
            widgetIds ? [...widgetIdsArray, 'filter', 'pluginsCatalog'].map(toIdObj) : []
        );
        // required for drill-down testing
        cy.intercept('GET', '/console/templates/pages', widgetIds ? ['blueprint', 'deployment'].map(toIdObj) : []);
        cy.intercept('GET', '/console/templates', []);
        cy.intercept('GET', '/console/ua', {
            appDataVersion: 4,
            appData: {
                pages: [
                    {
                        name: 'Test Page',
                        id: 'test_page',
                        layout: widgetIds
                            ? [
                                  {
                                      type: 'widgets',
                                      content: [
                                          {
                                              id: 'filter',
                                              definition: 'filter',
                                              configuration: {
                                                  filterByBlueprints: true,
                                                  filterByDeployments: true,
                                                  filterByExecutionsStatus: true,
                                                  allowMultipleSelection: true
                                              },
                                              height: 2,
                                              width: 8,
                                              x: 0,
                                              y: 0
                                          },
                                          ..._.map(widgetIdsArray, (widgetId, index) => ({
                                              id: widgetId,
                                              definition: widgetId,
                                              configuration: widgetConfiguration,
                                              height: 20,
                                              drillDownPages: {},
                                              width: 8,
                                              x: 0,
                                              y: 2 + (index + 1) * 20
                                          }))
                                      ]
                                  }
                              ]
                            : []
                    },
                    // used by tests that require plugins
                    {
                        name: 'Plugins Catalog',
                        id: 'plugin_catalog',
                        layout: [
                            {
                                type: 'widgets',
                                content: [
                                    {
                                        id: 'pluginsCatalog',
                                        definition: 'pluginsCatalog',
                                        configuration: {
                                            jsonPath:
                                                'http://repository.cloudifysource.org/cloudify/wagons/plugins.json'
                                        },
                                        height: 20
                                    }
                                ]
                            }
                        ]
                    },
                    { id: 'admin_operations' },
                    { id: 'deployments' }
                ]
            }
        });
    },
    refreshPage: () => cy.get('.pageMenuItem.active').click({ force: true }),
    refreshTemplate: () => {
        cy.get('.tenantsMenu').click({ force: true });
        cy.contains('.text', 'default_tenant').click({ force: true });
    },
    setBlueprintContext: (value: string) => setContext('blueprint', value),
    clearBlueprintContext: () => clearContext('blueprint'),

    setDeploymentContext: (value: string) => setContext('deployment', value),
    clearDeploymentContext: () => clearContext('deployment'),

    interceptSp: (method: StringMatcher, su: string | RegExp, routeHandler?: RouteHandler) =>
        cy.intercept(
            {
                method,
                pathname: '/console/sp',
                query: { su: su instanceof RegExp ? su : RegExp(`.*${_.escapeRegExp(su)}.*`) }
            },
            routeHandler
        ),
    getByTestId: (id: string) => cy.get(`[data-testid=${id}]`)
};

addCommands(commands);

function toIdObj(id: string) {
    return { id };
}

function setContext(field: string, value: string) {
    cy.get(`.${field}FilterField`).click();
    cy.get(`.${field}FilterField input`).clear({ force: true }).type(`${value}`, { force: true });
    cy.waitUntilPageLoaded();
    cy.contains('.text', value).click();
    cy.get(`.${field}FilterField input`).type('{esc}', { force: true });
}

function clearContext(field: string) {
    cy.get(`.${field}FilterField .dropdown.icon`).click();
}