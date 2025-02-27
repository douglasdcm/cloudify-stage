import request from 'supertest';
import app from 'app';

jest.mock('handler/ManagerHandler', () => ({
    getManagerUrl: () => 'http://blank.page',
    updateOptions: () => ({})
}));

describe('/plugins/icons/:pluginId endpoint', () => {
    it('returns status code 200 if plugin icon does not exist', () => {
        return request(app)
            .get('/console/plugins/icons/cloudify-aws-plugin')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });
});
