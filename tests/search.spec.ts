import { test, expect } from '../src/fixtures/test';
import { searchData } from '../src/data/testData';
import { isSortedAscending, isSortedDescending } from '../src/utils/price';

test.describe('Product search', { tag: '@search' }, () => {
  for (const keyword of searchData.validKeywords) {
    test(
      `searching "${keyword}" returns matching results`,
      { tag: '@smoke' },
      async ({ homePage, searchResultsPage, page }) => {
        await test.step(`search for "${keyword}" from the home page`, async () => {
          await homePage.open();
          await homePage.header.search(keyword);
          await searchResultsPage.waitForLoaded();
        });

        await test.step('results page reflects the keyword', async () => {
          await expect(page).toHaveURL(new RegExp(`q=${keyword}`));
          await expect(searchResultsPage.resultSummary).toContainText(keyword);
          await expect(searchResultsPage.productCards.first()).toBeVisible();
        });
      },
    );
  }

  test('search can be submitted with the SEARCH button', async ({ homePage, searchResultsPage }) => {
    await homePage.open();
    await homePage.header.searchByButton('laptop');
    await searchResultsPage.waitForLoaded();

    await expect(searchResultsPage.resultSummary).toContainText('laptop');
  });

  test('result titles are relevant to the keyword', { tag: '@regression' }, async ({ searchResultsPage }) => {
    await searchResultsPage.openFor('laptop');
    const titles = await searchResultsPage.productTitles(10);
    const relevant = titles.filter((t) => /laptop|notebook/i.test(t));

    // Sponsored items may appear, so require a clear majority rather than 100%.
    expect(relevant.length, `titles: ${titles.join(' | ')}`).toBeGreaterThanOrEqual(6);
  });

  test('sort by price: low to high', { tag: '@regression' }, async ({ searchResultsPage, page }) => {
    await searchResultsPage.openFor(searchData.sortKeyword);
    await searchResultsPage.sortBy('Price low to high');

    await expect(page).toHaveURL(/sort=priceasc/);
    const prices = await searchResultsPage.productPrices(10);
    expect(isSortedAscending(prices), `prices: ${prices}`).toBe(true);
  });

  test('sort by price: high to low', { tag: '@regression' }, async ({ searchResultsPage, page }) => {
    await searchResultsPage.openFor(searchData.sortKeyword);
    await searchResultsPage.sortBy('Price high to low');

    await expect(page).toHaveURL(/sort=pricedesc/);
    const prices = await searchResultsPage.productPrices(10);
    expect(isSortedDescending(prices), `prices: ${prices}`).toBe(true);
  });

  test('pagination navigates to page 2', { tag: '@regression' }, async ({ searchResultsPage, page }) => {
    await searchResultsPage.openFor(searchData.sortKeyword);
    const firstPageTitles = await searchResultsPage.productTitles(5);

    await searchResultsPage.goToPage(2);

    await expect(page).toHaveURL(/page=2/);
    await expect(searchResultsPage.activePage).toHaveAttribute('title', '2');
    expect(await searchResultsPage.productTitles(5)).not.toEqual(firstPageTitles);
  });
});
