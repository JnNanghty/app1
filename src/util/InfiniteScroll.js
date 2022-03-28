import {nextTick} from 'vue';

export const SCOPE = 'Vue3InfiniteScroll'
const InfiniteScroll = {
  mounted(el, binding, vnode) {
    const checkFull = () => {
      if (document.documentElement.clientHeight >= el.clientHeight) {
        el[SCOPE].expression.call();
      } else {
        if (el.observer) {
          el.observer.disconnect();
        }
      }
    };

    const doCheck = () => {
      const {container} = el[SCOPE];
      const containerScrollTop = container === window ? container.document.documentElement.scrollTop : container.scrollTop;
      const containerClientHeight = container === window ? container.document.documentElement.clientHeight : container.clientHeight;
      const elClientHeight = el.clientHeight;
      const shouldTrigger = containerScrollTop + containerClientHeight + 200 > elClientHeight;
      if (shouldTrigger) {
        el[SCOPE].expression.call();
      }
    };

    const throttle = (fn, delay) => {
      //节流函数
      var now, lastExec, timer, context, args; //eslint-disable-line
      var execute = function () {
        fn.apply(context, args);
        lastExec = now;
      };
      return function () {
        context = this;
        args = arguments;

        now = Date.now();

        if (timer) {
          clearTimeout(timer);
          timer = null;
        }

        if (lastExec) {
          var diff = delay - (now - lastExec);
          if (diff < 0) {
            execute();
          } else {
            timer = setTimeout(() => {
              execute();
            }, diff);
          }
        } else {
          execute();
        }
      };
    };

    //获取添加监听的Dom,获取到overflowY设置为‘scroll’或者‘auto’的节点，或者返回window对象
    const getScrollEventTarget = (element) => {
      let currentNode = element;
      while (currentNode && currentNode.tagName !== 'HTML' && currentNode.tagName !== 'BODY' && currentNode.nodeType === 1) {
        const overflowY = getComputedStyle(currentNode).overflowY;
        if (overflowY === 'scroll' || overflowY === 'auto') {
          return currentNode;
        }
        currentNode = currentNode.parentNode;
      }
      return window;
    };

    const throttleDelayExpr = el.getAttribute('infinite-scroll-throttle-delay') ? el.getAttribute('infinite-scroll-throttle-delay') : 1000;
    el[SCOPE] = {
      el,
      vm: vnode.context,
      expression: binding.value,
      config: {
        eventName: el.getAttribute('infinite-scroll-listen-for-event'),
        immediateCheckExpr: el.getAttribute('infinite-scroll-immediate-check') ? el.getAttribute('infinite-scroll-immediate-check') : true,
        distanceExpr: el.getAttribute('infinite-scroll-distance') ? el.getAttribute('infinite-scroll-distance') : 200,
        throttleDelayExpr
      },
      container: getScrollEventTarget(el),
      onScroller: throttle(doCheck, throttleDelayExpr),
    };

    const bind = async () => {
      await nextTick();
      const {config, onScroller} = el[SCOPE];
      if (config.immediateCheckExpr) {
        const observer = new MutationObserver(
          checkFull
        )
        el.observer = observer;      //设置成全局
        observer.observe(el, {attributes: true, childList: true, subtree: true});
      }
      el[SCOPE].container.addEventListener("scroll", onScroller);
      el[SCOPE].expression.call();
    }
    bind();
  },
  beforeUnmount(el) {
    const {container, onScroller} = el[SCOPE]
    container && container.removeEventListener('scroll', onScroller)
    // destroyObserver(el)
  }
};
export default InfiniteScroll;
