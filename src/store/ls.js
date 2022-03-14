import router from "@/router";
/**
 * 可设置过期时间的Storage
 * 如果有过期时间就额外保存一个超时时间值，每次get判断是否超时， 如果超时就删除并返回null
 * */
class storage {
  constructor(props) {
    this.props = props || {}
    this.source = this.props.source || window.localStorage
    this.init()
  }

  init() {
    const reg = new RegExp('__expires__');
    let data = this.source;
    let list = Object.keys(data);

    if (list.length > 0) {
      list.map((key) => {
        if (!reg.test(key)) {
          let now = Date.now();
          let expires = data[`${key}__expires__`] || Date.now + 1;
          if (now >= expires) {
            this.remove(key);
          }
        }
        return key;
      });
    }
  }

  /**
   * @param key {String}
   * @param value {String, Number, Object}
   * @param {Number, Boolean} [expire]  超时时间(可选)
   * */
  set(key, value, expire) {
    let source = this.source;
    source[key] = JSON.stringify(value);
    if (expire) {
      source[`${key}__expires__`] = Date.now() + expire
    }
  }

  /**
   * @param key {String}
   * */
  get(key) {
    const source = this.source,
      expired = source[`${key}__expires__`] || Date.now + 1;
    const now = Date.now();
    if (now >= expired) {
      this.remove(key);
      if(key === 'token') {
        router.replace({
          name: 'Home'
        }).then(() => {
          msg({
            message: '请重新登陆！'
          })
        });
      }
      return null;
    }
    return source[key] ? JSON.parse(source[key]) : source[key];
  }

  remove(key) {
    const data = this.source;
    delete data[key];
    delete data[`${key}__expires__`];
  }
}

const ls = new storage();
export default ls;
