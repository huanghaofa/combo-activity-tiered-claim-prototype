(function () {
  'use strict';

  var allowed = ['activity', 'login', 'lottery', 'result', 'upgrade', 'coupon-center'];

  function current() {
    var route = String(window.location.hash || '').replace(/^#\/?/, '').split('?')[0];
    return allowed.indexOf(route) >= 0 ? route : 'activity';
  }

  function render() {
    if (window.ComboApp) window.ComboApp.render(current());
  }

  function go(route, replace) {
    var target = allowed.indexOf(route) >= 0 ? route : 'activity';
    if (replace) window.history.replaceState(null, '', window.location.pathname + window.location.search + '#' + target);
    else window.location.hash = target;
    render();
  }

  window.ComboRouter = { current: current, go: go, refresh: render };
  window.addEventListener('hashchange', render);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
