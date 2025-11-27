import { Api } from './Api';

export const api = new Api({
    baseURL: 'http://localhost:8001/api',
    securityWorker: (token) => {
        if (token) {
            return {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
        }
        return {};
    },
});

const token = localStorage.getItem('token');
if (token) {
    api.setSecurityData(token);
}
