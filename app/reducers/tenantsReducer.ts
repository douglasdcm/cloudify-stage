// @ts-nocheck File not migrated fully to TS

import _ from 'lodash';
import * as types from '../actions/types';

const tenants = (state = {}, action) => {
    let selectedTenant;
    switch (action.type) {
        case types.REQ_TENANTS:
            return { ...state, isFetching: true };
        case types.RES_TENANTS:
            selectedTenant = _.get(action.tenants, 'items[0].name', null);
            if (!_.isEmpty(state.selected) && _.find(action.tenants.items, { name: state.selected }) != null) {
                selectedTenant = state.selected;
            }
            return {
                ...state,
                isFetching: false,
                items: action.tenants.items,
                selected: selectedTenant,
                lastUpdated: action.receivedAt
            };
        case types.ERR_TENANTS:
            return { ...state, isFetching: false, error: action.error, items: [], lastUpdated: action.receivedAt };
        case types.SELECT_TENANT:
            return { ...state, selected: action.tenant };
        default:
            return state;
    }
};

export default tenants;
