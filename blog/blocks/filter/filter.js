export default async function decorate(block) {
  block.textContent = '';
  let filters = await getFilters();
  filters.forEach((filter) => {
    block.append(createFilter(filter, "filter"));
  });
}

export async function getFilters() {
  const resp = await fetch('/product-updates/data.json');
  const json = await resp.json();
  return (json.data);
}

export function createFilter(filter, classPrefix) {
  const card = document.createElement('div');
  card.className = `${classPrefix}-card`;
  card.innerHTML = `<div class="${classPrefix}-header">
    <span class="${classPrefix}-plan-type">${filter.planType}</span> 
    </div>`;
  return (card);
}
