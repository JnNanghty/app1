function MessageBox({message = '', duration}) {
  const wrap = document.createElement('div');
  wrap.setAttribute('style', `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      margin: 0 auto;
      min-width: 10rem;
      width: fit-content;
      padding: .5rem 1rem 0;
      height: 2rem;
      background: #0069ff;
      border-bottom-left-radius: 1.5rem;
      border-bottom-right-radius: 1.5rem;
      z-index: 3000;
      opacity: 1;
      text-align: center;
      color: #ffffff;
      font-size: 1rem;
    `);
  const keyframe = [
    {transform: 'translateY(-100%)'},
    {transform: 'translateY(0)'}
  ];
  wrap.animate(keyframe, {
    duration: 300,
    fill: 'forwards',
    easing: 'ease'
  });
  wrap.innerHTML = message;

  document.body.appendChild(wrap);

  setTimeout(() => {
    close();
  }, duration || 2e3);

  function close() {
    const keyframe = [
      {transform: 'translateY(0)'},
      {transform: 'translateY(-100%)'}
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
