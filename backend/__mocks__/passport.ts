import type { RequestHandler } from 'express';
import { noop } from 'lodash';

const middlewareMock: RequestHandler = (req, _res, next) => {
    req.user = { username: 'testuser', role: '', group_system_roles: {}, tenants: {} };
    next();
};

export default {
    authenticate: () => middlewareMock,
    initialize: () => middlewareMock,
    use: noop
};
