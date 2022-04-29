import ls from "@/store/ls";

const TokenKey = 'token';
export function getToken() {
  return ls.get(TokenKey);
}

export function setToken(token) {
  ls.set(TokenKey, token, 3e5); // 10分钟 600000  改为5分钟
}

export function removeToken() {
  ls.remove('userInfo')
  ls.remove(TokenKey)
}
