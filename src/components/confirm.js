function Confirm({message = '', ok}) {
  const shadow = document.createElement('div')
  shadow.classList.add('__confirm-shadow')

  const wrap = document.createElement('div');
  wrap.classList.add('__confirm-wrap')

  const keyframe = [
    {opacity: 0},
    {opacity: 1}
  ];
  shadow.animate(keyframe, {
    duration: 300,
    fill: 'forwards',
    easing: 'ease'
  });

  const content = document.createElement('div');
  content.innerText = message;
  content.classList.add('__confirm-content')

  const buttonWrap = document.createElement('div')
  buttonWrap.classList.add('__confirm-button-wrap')
  const okButton = document.createElement('div')
  okButton.innerText = '确认'
  okButton.classList.add('__confirm-ok')
  const cancelButton = document.createElement('div')
  cancelButton.innerText = '取消'
  cancelButton.classList.add('__confirm-cancel')
  okButton.addEventListener('click', () => {
    ok && ok();
    close();
  })
  cancelButton.addEventListener('click', () => {
    close();
  })
  const closeIcon = document.createElement('img')
  closeIcon.classList.add('__confirm-close')
  closeIcon.alt = ''
  closeIcon.src = require('@/assets/close.png');
  closeIcon.addEventListener('click', () => {
    close()
  })

  buttonWrap.appendChild(okButton)
  buttonWrap.appendChild(cancelButton)
  wrap.appendChild(closeIcon)
  wrap.appendChild(content)
  wrap.appendChild(buttonWrap)
  shadow.appendChild(wrap)
  document.body.appendChild(shadow);


  function close() {
    const keyframe = [
      {opacity: 1},
      {opacity: 0}
    ];
    const downAnimate = shadow.animate(keyframe, {
      duration: 300,
      fill: 'forwards',
      easing: 'ease'
    });
    downAnimate.onfinish = () => {
      destroy();
    };
  }

  function destroy() {
    document.body.removeChild(shadow);
  }
}

export function myConfirm(options) {
  new Confirm(options);
}

// window.myConfirm = confirm;
