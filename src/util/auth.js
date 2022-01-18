import ls from "@/store/ls";

const TokenKey = 'token';
export function getToken() {
  return ls.get(TokenKey);
}

export function setToken(token) {
  return ls.set(TokenKey, token, 6e5); // 10分钟 600000
}

export function removeToken() {
  return ls.remove(TokenKey)
}
