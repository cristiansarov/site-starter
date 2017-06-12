import { createMemoryHistory } from 'history';
import useNamedRoutes from 'use-named-routes';


export default function(routes) {
  return useNamedRoutes(createMemoryHistory)({ basename:'/', routes });
}