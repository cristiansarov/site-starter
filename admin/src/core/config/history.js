import { createHistory } from 'history';
import routes from 'core/config/routes';
import { useRouterHistory } from 'react-router';
import useNamedRoutes from 'use-named-routes';
const history = useNamedRoutes(useRouterHistory(createHistory))({ basename: '/admin/', routes });

export default history
