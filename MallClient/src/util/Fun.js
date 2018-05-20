export let Fun = {
  getCookie(name) {
    let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    return (arr = document.cookie.match(reg)) ? unescape(arr[2]) : null;
  },
  removeItem(arr, item) {
    let index = this.getIndexOf(arr, item);
    if (index > -1) {
      arr.splice(index, 1);
    }
  },
  getIndexOf(arr, item) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === item) return i;
    }
    return -1;
  },
  currency(value, currency, decimals) {
    const digitsRE = /(\d{3})(?=\d)/g;
    value = parseFloat(value);
    if (!isFinite(value) || (!value && value !== 0)) return '';
    currency = currency != null ? currency : '$';
    decimals = decimals != null ? decimals : 2;
    let stringified = Math.abs(value).toFixed(decimals)
    let _int = decimals
      ? stringified.slice(0, -1 - decimals)
      : stringified;
    let i = _int.length % 3;
    let head = i > 0
      ? (_int.slice(0, i) + (_int.length > 3 ? ',' : ''))
      : '';
    let _float = decimals
      ? stringified.slice(-1 - decimals)
      : '';
    let sign = value < 0 ? '-' : '';
    return sign + currency + head +
      _int.slice(i).replace(digitsRE, '$1,') +
      _float
  }
};
