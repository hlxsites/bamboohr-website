import { decorateIcons } from '../../scripts/scripts.js';

/**
 * loads and decorates the footer
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  const resp = await fetch('/blog/fixtures/footer.plain.html');
  const html = await resp.text();
  block.innerHTML = html;
  decorateIcons(block);
  const styles = ['company', 'support', 'links', 'blog', 'social', 'brand', 'legal'];
  styles.forEach((style, i) => {
    if (block.children[i]) block.children[i].classList.add(style);
  });

  const $teconsent = document.createElement('div');
  $teconsent.id = 'teconsent';
  block.querySelector('a[href^="https://consent-pref.trustarc.com/"]').replaceWith($teconsent);

  const $consent = document.createElement('div');
  $consent.id = 'consent-banner';
  block.after($consent);
}
