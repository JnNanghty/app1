function MessageBox({message = '', duration, type = null}) {
  const wrap = document.createElement('div');
  wrap.classList.add('__message-content')

  const keyframe = [
    {opacity: 0},
    {opacity: 1}
  ];
  wrap.animate(keyframe, {
    duration: 300,
    fill: 'forwards',
    easing: 'ease'
  });
  const icon = document.createElement('img')
  icon.setAttribute('style', `
      margin-right: 1rem;
      width: 1rem;
      height: 1rem;
      vertical-align: middle;
    `)
  icon.alt = ''
  if (type === 'success') {
    icon.src = require('@/assets/success.png')
    wrap.appendChild(icon)
  } else if (type === 'wrong') {
    icon.src = require('@/assets/wrong.png')
    wrap.appendChild(icon)
  }

  const content = document.createElement('span');
  content.innerText = message;
  wrap.appendChild(content)

  document.body.appendChild(wrap);

  setTimeout(() => {
    close();
  }, duration || 2e3);

  function close() {
    const keyframe = [
      {opacity: 1},
      {opacity: 0}
    ];
    const downAnimate = wrap.animate(keyframe, {
      duration: 300,
      fill: 'forwards',
      easing: 'ease'
    });
    downAnimate.onfinish = () => {
      destroy();
    };
  }

  function destroy() {
    document.body.removeChild(wrap);
  }
}

export function msg(options) {
  new MessageBox(options);
}

// window.msg = msg;
