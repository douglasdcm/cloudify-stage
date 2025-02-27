// @ts-nocheck File not migrated fully to TS
import i18n from 'i18next';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import log from 'loglevel';

import Home from '../Home';
import PageManagement from '../templateManagement/pages/PageManagement';
import Consts from '../../utils/consts';
import { NO_PAGES_FOR_TENANT_ERR, UNAUTHORIZED_ERR } from '../../utils/ErrorCodes';
import SplashLoadingScreen from '../../utils/SplashLoadingScreen';

import StatusPoller from '../../utils/StatusPoller';
import UserAppDataAutoSaver from '../../utils/UserAppDataAutoSaver';
import ScrollToTop from './ScrollToTop';
import TemplateManagement from '../templateManagement/TemplateManagement';

export default class Layout extends Component {
    static initialState = {
        initialized: false
    };

    constructor(props, context) {
        super(props, context);
        this.state = Layout.initialState;
    }

    componentDidMount() {
        const { doLogout, initialPageLoad } = this.props;
        initialPageLoad()
            .then(() => {
                StatusPoller.getPoller().start();
                UserAppDataAutoSaver.getAutoSaver().start();
                this.setState({ initialized: true });
            })
            .catch(e => {
                switch (e) {
                    case UNAUTHORIZED_ERR: // Handled by Interceptor
                        break;
                    case NO_PAGES_FOR_TENANT_ERR:
                        log.error('Cannot initialize user data because no pages were found for the current tenant');
                        doLogout(i18n.t('noPages'));
                        break;
                    default:
                        log.error('Initializing user data failed', e);
                        doLogout(i18n.t('pageLoadError', 'Error initializing user data, cannot load page'));
                }
            });
    }

    componentWillUnmount() {
        StatusPoller.getPoller().stop();
        UserAppDataAutoSaver.getAutoSaver().stop();
    }

    render() {
        const { isLoading, isUserAuthorizedForTemplateManagement } = this.props;
        const { initialized } = this.state;

        if (isLoading) {
            SplashLoadingScreen.turnOn();
            return null;
        }
        SplashLoadingScreen.turnOff();

        if (!initialized) {
            return null;
        }

        return (
            <ScrollToTop>
                <Switch>
                    {isUserAuthorizedForTemplateManagement && (
                        <Route exact path="/template_management" component={TemplateManagement} />
                    )}
                    {isUserAuthorizedForTemplateManagement && (
                        <Route
                            exact
                            path="/page_preview/:pageId"
                            render={({ match }) => <PageManagement pageId={match.params.pageId} />}
                        />
                    )}
                    {isUserAuthorizedForTemplateManagement && (
                        <Route
                            exact
                            path="/page_edit/:pageId"
                            render={({ match }) => <PageManagement pageId={match.params.pageId} isEditMode />}
                        />
                    )}
                    <Route exact path="/page/:pageId/:pageName" component={Home} />
                    <Route exact path="/page/:pageId" component={Home} />
                    <Route exact path={Consts.HOME_PAGE_PATH} component={Home} />
                    <Route render={() => <Redirect to={Consts.ERROR_404_PAGE_PATH} />} />
                </Switch>
            </ScrollToTop>
        );
    }
}

Layout.propTypes = {
    doLogout: PropTypes.func.isRequired,
    initialPageLoad: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isUserAuthorizedForTemplateManagement: PropTypes.bool.isRequired
};
