export default async function decorate(block) {
  block.textContent = '';
  let filters = await getFilters();

  let planTypes = uniqueFilters(filters, 'planType');
  planTypes.forEach((planType) => {
    block.append(createFilter(planType, "filterPlanType"));
  });

  let productAreas = uniqueFilters(filters, 'productArea');

  productAreas.forEach((productArea) => {
    block.append(createFilter(productArea, "filterProductArea"));
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
    <input type="checkbox" class="${classPrefix}-plan-type" id="${filter.planType}">${filter.planType}</input> 
    </div>`;
  return (card);
}

function uniqueFilters(array, key) {
  return [...new Map(array.map((x) => [x[key], x])).values()];
}
