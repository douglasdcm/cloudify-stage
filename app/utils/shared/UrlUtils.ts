import _ from 'lodash';
import Const from '../consts';

export default class UrlUtils {
    static appendQueryParam(url: string, param: string, value: string | number) {
        return `${url}${url.indexOf('?') > 0 ? '&' : '?'}${param}=${value}`;
    }

    static url(path: string) {
        if (path === Const.HOME_PAGE_PATH) {
            return Const.CONTEXT_PATH;
        }

        return Const.CONTEXT_PATH + (_.startsWith(path, '/') ? '' : '/') + path;
    }

    static isUrl(str: string) {
        // RegEx from: https://stackoverflow.com/questions/1410311/regular-expression-for-url-validation-in-javascript#15734347
        const regexp = /^(ftp|http|https):\/\/[^ "]+$/;

        return regexp.test(str);
    }

    static redirectToPage(url: string) {
        window.open(url, '_blank');
    }

    static widgetResourceUrl(widgetId: string, internalPath: string, isCustom = true, addContextPath = true) {
        return addContextPath
            ? UrlUtils.url(
                  `${isCustom ? Const.USER_DATA_PATH : Const.APP_DATA_PATH}/widgets/${widgetId}${
                      _.startsWith(internalPath, '/') ? '' : '/'
                  }${internalPath}`
              )
            : `${isCustom ? Const.USER_DATA_PATH : Const.APP_DATA_PATH}/widgets/${widgetId}${
                  _.startsWith(internalPath, '/') ? '' : '/'
              }${internalPath}`;
    }
}
