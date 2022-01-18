const ws = 'ws://';

const websocket = new WebSocket(ws);
websocket.onmessage = (e) => {
  const data = JSON.parse(e.data);
  console.log(data);
}
websocket.onopen = () => {
}
websocket.onerror = () => {
}
websocket.onclose = () => {
}
