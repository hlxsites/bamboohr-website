import {
  loadFragment,
  toClassName,
  decorateIcons,
  insertNewsletterForm,
} from '../../scripts/scripts.js';

/**
 * collapses all open nav sections
 * @param {Element} sections The container element
 */

function collapseAll(elems) {
  elems.forEach((section) => {
    section.setAttribute('aria-expanded', 'false');
  });
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  block.textContent = '';

  // fetch nav content
  const resp = await fetch('/blog/fixtures/nav.plain.html');
  let html = await resp.text();

  // forward compatibility
  html = html.replaceAll('<ol>', '<ul>');
  html = html.replaceAll('</ol>', '</ul>');

  // decorate nav DOM
  const nav = document.createElement('div');
  nav.classList.add('nav');
  const navSections = document.createElement('div');
  navSections.classList.add('nav-sections');
  nav.innerHTML = html;
  decorateIcons(nav);
  nav.querySelectorAll(':scope > div').forEach((navSection, i) => {
    if (!i) {
      // first section is the brand section
      const brand = navSection;
      brand.classList.add('nav-brand');
      nav.insertBefore(navSections, brand.nextElementSibling);
    } else {
      // all other sections
      const h2 = navSection.querySelector('h2');
      if (h2) {
        const ul = navSection.querySelector('ul');
        if (!ul) {
          navSection.classList.add(`nav-section-${toClassName(h2.textContent)}`);
          const wrapper = document.createElement('div');
          wrapper.className = 'nav-section-wrapper';
          while (h2.nextElementSibling) wrapper.append(h2.nextElementSibling);
          navSection.append(wrapper);
        }
        navSections.append(navSection);
        navSection.classList.add('nav-section');
        h2.addEventListener('click', () => {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          collapseAll([...navSections.children]);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        });
        navSection.querySelectorAll(':scope > ul > li').forEach((li) => {
          if (!li.querySelector(':scope > a')) {
            li.addEventListener('click', () => {
              const expanded = li.getAttribute('aria-expanded') === 'true';
              collapseAll([...nav.querySelectorAll('li[aria-expanded="true"]')]);
              li.setAttribute('aria-expanded', expanded ? 'false' : 'true');
            });
          }
        });
      } else {
        const buttons = navSection;
        buttons.className = 'nav-buttons';
        buttons.querySelectorAll('a').forEach((a) => {
          a.classList.add('button', 'small');
          if (a.parentElement.tagName === 'EM') {
            a.classList.add('light');
          }
        });
      }
    }
  });

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = '<div class="nav-hamburger-icon"></div>';
  hamburger.addEventListener('click', () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    document.body.style.overflowY = expanded ? '' : 'hidden';
    nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  });
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  const createSearch = () => {
    const div = document.createElement('div');
    div.className = 'header-search';
    div.innerHTML = `<a data-modal="/tools/search"><img src="${window.hlx.codeBasePath}/icons/search.svg" class="icon icon-search"></a>`;
    div.addEventListener('click', async () => {
      const elem = document.getElementById('header-search-modal');
      if (!elem) {
        const modal = document.createElement('div');
        modal.className = 'header-search-modal';
        modal.id = 'header-search-modal';
        modal.innerHTML = '<div class="header-search-close"></div>';
        const fragment = await loadFragment('/blog/fixtures/search');
        modal.append(fragment);
        block.append(modal);
        modal.classList.add('visible');
        const close = modal.querySelector('.header-search-close');
        close.addEventListener('click', () => {
          modal.classList.remove('visible');
        });
      } else {
        elem.classList.add('visible');
      }
    });
    return (div);
  };

  block.append(nav);

  insertNewsletterForm(block, () => {
    collapseAll([...nav.querySelectorAll('[aria-expanded="true"]')]);
  });

  block.append(createSearch());
}
