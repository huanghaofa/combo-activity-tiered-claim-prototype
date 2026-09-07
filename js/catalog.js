(function () {
  'use strict';

  var source = Array.isArray(window.PreviewCatalog) ? window.PreviewCatalog : [];
  var categories = ['结果页面', '参与流程', '抽奖分支', '等级操作', '时间与异常', '跳转'];
  var selectedCategory = '全部';
  var searchValue = '';
  var list = document.getElementById('scenario-list');
  var filters = document.getElementById('category-filters');
  var count = document.getElementById('scenario-count');
  var empty = document.getElementById('empty-state');
  var search = document.getElementById('scenario-search');
  var clear = document.getElementById('clear-search');
  var reset = document.getElementById('reset-filters');
  var form = document.getElementById('search-form');

  if (!list || !filters || !count || !empty || !search || !clear || !reset || !form) return;

  var entries = source.filter(function (item) {
    return item && typeof item.scene === 'string' && item.scene && typeof item.title === 'string';
  });
  entries.forEach(function (item) {
    if (item.category && categories.indexOf(item.category) < 0) categories.push(item.category);
  });

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = String(text);
    return node;
  }

  function normalize(value) {
    return String(value || '').toLocaleLowerCase().replace(/\s+/g, ' ').trim();
  }

  function buildFilters() {
    var fragment = document.createDocumentFragment();
    ['全部'].concat(categories).forEach(function (category) {
      var categoryCount = category === '全部' ? entries.length : entries.filter(function (item) { return item.category === category; }).length;
      var button = element('button', 'category-filter', category);
      button.type = 'button';
      button.setAttribute('aria-pressed', String(selectedCategory === category));
      button.setAttribute('data-category', category);
      button.appendChild(element('span', '', categoryCount));
      button.addEventListener('click', function () {
        selectedCategory = category;
        update();
      });
      fragment.appendChild(button);
    });
    filters.replaceChildren(fragment);
  }

  function card(item) {
    var outer = element('li');
    var link = element('a', 'scenario-card');
    link.href = 'activity.html?scene=' + encodeURIComponent(item.scene) + '#' + encodeURIComponent(item.route || 'result');
    link.setAttribute('aria-label', '查看场景：' + item.title);
    if (item.id) link.setAttribute('data-scenario-id', String(item.id));
    var top = element('div', 'card-topline');
    top.appendChild(element('span', 'card-category', item.category || '场景'));
    top.appendChild(element('span', 'card-index', String(entries.indexOf(item) + 1).padStart(2, '0')));
    link.appendChild(top);
    link.appendChild(element('h3', '', item.title));
    if (item.description) link.appendChild(element('p', 'card-description', item.description));
    if (item.steps) {
      var steps = element('p', 'card-steps');
      steps.appendChild(element('strong', '', '查看步骤'));
      steps.appendChild(document.createTextNode(String(item.steps)));
      link.appendChild(steps);
    }
    var action = element('div', 'card-action', '查看场景');
    var arrow = element('span', '', '→');
    arrow.setAttribute('aria-hidden', 'true');
    action.appendChild(arrow);
    link.appendChild(action);
    outer.appendChild(link);
    return outer;
  }

  function update() {
    var words = normalize(searchValue).split(' ').filter(Boolean);
    var matches = entries.filter(function (item) {
      if (selectedCategory !== '全部' && item.category !== selectedCategory) return false;
      var text = normalize([item.title, item.description, item.steps, item.category].join(' '));
      return words.every(function (word) { return text.indexOf(word) >= 0; });
    });
    filters.querySelectorAll('button').forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.getAttribute('data-category') === selectedCategory));
    });
    var fragment = document.createDocumentFragment();
    matches.forEach(function (item) { fragment.appendChild(card(item)); });
    list.replaceChildren(fragment);
    list.hidden = matches.length === 0;
    empty.hidden = matches.length !== 0;
    count.textContent = selectedCategory === '全部' && !words.length ? '共 ' + entries.length + ' 个演示场景' : '找到 ' + matches.length + ' 个场景 · 共 ' + entries.length + ' 个';
    clear.hidden = searchValue.length === 0;
    if (!entries.length) {
      empty.querySelector('h3').textContent = '场景列表暂未载入';
      empty.querySelector('p').textContent = '可刷新页面重试，或通过上方入口直接查看活动原型。';
      reset.hidden = true;
    }
  }

  search.addEventListener('input', function () {
    searchValue = search.value;
    update();
  });
  clear.addEventListener('click', function () {
    search.value = '';
    searchValue = '';
    update();
    search.focus();
  });
  reset.addEventListener('click', function () {
    search.value = '';
    searchValue = '';
    selectedCategory = '全部';
    update();
    search.focus();
  });
  form.addEventListener('submit', function (event) { event.preventDefault(); });

  buildFilters();
  update();
})();
