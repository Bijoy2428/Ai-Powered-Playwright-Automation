import { test } from '@playwright/test';

/**
 * Method decorator that wraps a page-object action in `test.step`,
 * so reports and traces show readable steps like "ProductPage.addToCart".
 */
export function step(name?: string) {
  return function <This extends object, Args extends unknown[], Return>(
    target: (this: This, ...args: Args) => Promise<Return>,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Promise<Return>>,
  ) {
    return function (this: This, ...args: Args): Promise<Return> {
      const stepName = name ?? `${this.constructor.name}.${String(context.name)}`;
      return test.step(stepName, () => target.call(this, ...args), { box: true });
    };
  };
}
