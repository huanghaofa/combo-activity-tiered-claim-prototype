(function () {
  'use strict';

  function escapeHTML(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function params() {
    return new URLSearchParams(window.location.search || '');
  }

  function query(name, fallback) {
    return params().get(name) || fallback;
  }

  function countCoupons(activities, predicate) {
    return (activities || []).reduce(function (total, activity) {
      return total + (activity.coupons || []).filter(predicate || function () { return true; }).length;
    }, 0);
  }

  function nextFrame(callback) {
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(callback);
    });
  }

  function showToast(message) {
    var old = document.querySelector('.toast');
    if (old) old.remove();
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.textContent = message;
    document.body.appendChild(toast);
    window.setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 2200);
  }

  window.ComboUtils = {
    escapeHTML: escapeHTML,
    clone: clone,
    query: query,
    countCoupons: countCoupons,
    nextFrame: nextFrame,
    showToast: showToast
  };
})();
