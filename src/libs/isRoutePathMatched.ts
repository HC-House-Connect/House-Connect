import { matchPath } from 'react-router-dom';

import { routePaths } from '@/constants/route';

const isFunction = (route: unknown): route is () => string =>
  typeof route === 'function';

const isRoutePathMatched = (
  currentRoutePath: string,
  routePath: keyof typeof routePaths | (keyof typeof routePaths)[],
) => {
  if (typeof routePath === 'string') {
    const path = routePaths[routePath];

    if (isFunction(path)) {
      // * react router dom matchPath API는 path가 일치한다면 객체를 반환하고 일치하지 않는다면 null을 반환한다.
      return !!matchPath(path(), currentRoutePath);
    }

    if (typeof path === 'string') {
      return !!matchPath(path, currentRoutePath);
    }
  } else if (Array.isArray(routePath)) {
    let isMatched = false;

    // eslint-disable-next-line no-restricted-syntax
    for (const path of routePath) {
      const targetPath = routePaths[path];
      if (isFunction(targetPath))
        isMatched = isMatched || !!matchPath(targetPath(), currentRoutePath);
      if (typeof targetPath === 'string')
        isMatched = isMatched || !!matchPath(targetPath, currentRoutePath);
    }
    return isMatched;
  }
  return false;
};

export default isRoutePathMatched;
