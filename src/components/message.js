class MessageBox extends HTMLElement {
  constructor({
                message = '',
                duration
              }) {
    super();
    const wrap = document.createElement('div');
    this.wrap = wrap;
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
    const shadow = this.attachShadow({mode: 'closed'});
    shadow.appendChild(wrap);
    setTimeout(() => {
      this.close();
    }, duration || 2e3);
  }

  close() {
    const keyframe = [
      {transform: 'translateY(0)'},
      {transform: 'translateY(-100%)'}
    ];
    const downAnimate = this.wrap.animate(keyframe, {
      duration: 300,
      fill: 'forwards',
      easing: 'ease'
    });
    downAnimate.onfinish = () => {
      this.destroy();
    };
  }

  destroy() {
    const body = document.getElementsByTagName('body')[0];
    body.removeChild(this);
  }
}

window.customElements.define('message-box', MessageBox);

export function msg(options) {
  const body = document.getElementsByTagName('body')[0];
  const msgDom = new MessageBox(options);
  body.appendChild(msgDom);
}
