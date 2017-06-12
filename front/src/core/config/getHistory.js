import { createHistory } from 'history';
import { useRouterHistory } from 'react-router';
import useNamedRoutes from 'use-named-routes';

export default function getHistory(routes) {
  const history = useNamedRoutes(useRouterHistory(createHistory))({ basename: '/', routes });
  history.listen(location => location.action === 'PUSH' && window.scrollTo(0, 0)); // scroll to top on location change
  return history
}
