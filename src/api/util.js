/**
 * 一天的毫秒数, 这里设置cookie 为天数
 * @constant {Number} _MILLISECONDS_OF_DAY
 */
const _MILLISECONDS_OF_DAY = 24 * 60 * 60 * 1000;
/**
 * cookie 操作
 * @static
 */
export class Cookie {
    /**
     * 获取一天毫秒数
     * @return {number}
     * @constructor
     */
    static get DATEDAY() {
        return _MILLISECONDS_OF_DAY;
    }
    /**
     * 获取指定名称cookie值
     * @param {String} name key name
     * @return {string} name The name of the cookie to retrieve
     */
    static get(name) {
        let ret;
        let m;
        if (typeof name === 'string' && name !== '') {
            if (
                (m = String(document.cookie).match(
                    new RegExp('(?:^| )' + name + '(?:(?:=([^;]*))|;|$)'),
                ))
            ) {
                ret = m[1] ? decodeURIComponent(m[1]) : '';
            }
        }
        return ret;
    }
    /**
     * 设置一个指定名称的cookie值
     * @param {String} name 要设置的cookie的名称
     * @param {String} val 要为cookie设置的值
     * @param {Number|Date} [expires] 如果为数字表示此cookie将过期多少天
     * @param {String} [domain] 设置cookie的域
     * @param {String} [path] 设置cookie的路径
     * @param {Boolean} [secure] 是否只能将此cookie发送到https上的服务器
     */
    static set(name, val, expires, domain, path, secure) {
        let text = String(encodeURIComponent(val));
        let date = expires;
        // 从当前时间开始，多少天后过期
        if (typeof date === 'number') {
            date = new Date();
            date.setTime(date.getTime() + expires * _MILLISECONDS_OF_DAY);
        }
        // expiration date
        if (date instanceof Date) {
            text += '; expires=' + date.toUTCString();
        }
        // domain
        if (typeof domain === 'string' && domain !== '') {
            text += '; domain=' + domain;
        }
        // path
        if (typeof path === 'string' && path !== '') {
            text += '; path=' + path;
        }
        // secure
        if (secure) {
            text += '; secure';
        }
        document.cookie = name + '=' + text;
    }
    /**
     * 通过将过期日期设置为过去的某个时间，从浏览器中删除cookie
     * @param {String} name 要删除的cookie的名称。
     * @param {String} [domain = location.host] cookie的域
     * @param {String} [path = location.pathname] cookie的路径
     * @param {Boolean} [secure = location.protocol === 'https:'] cookie的安全选项
     */
    static remove(name, domain, path, secure) {
        this.set(name, '', -1, domain, path, secure);
    }
}
export default Cookie;
