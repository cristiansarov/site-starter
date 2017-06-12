import Main from 'Main/MainComponent';
import Home from '../../modules/Home/HomeScreen';
import NotFound from 'Main/NotFound/NotFoundComponent';
import appScreens from '../../screens';


export default function getRoutes(rawRoutes) {
  const appRoutes = rawRoutes.map(route=>transformRoute(route));
  return {
    path: '/',
    name: 'Main',
    breadcrumbName: 'Home',
    component: Main,
    indexRoute: {component: Home, name: 'Home', breadcrumbIgnore: true},
    childRoutes: [
      ...appRoutes,
      {path: '*', component: NotFound}
    ]
  };
}

function transformRoute(route) {
  const newRoute = {
    path: route.path,
    name: route.name,
    component: appScreens[route.componentName] || (props=>props.children),
  };
  if(route.indexRoute) {
    newRoute.indexRoute = {
      name: route.indexRoute.name,
      component: appScreens[route.indexRoute.componentName] || (()=>null)
    }
  }
  if(route.redirectTo) {
    newRoute.onEnter = (nextState, replace) => replace({name: route.redirectTo})
  }
  if(route.childRoutes) {
    newRoute.childRoutes = route.childRoutes.map(route=>transformRoute(route));
  }
  return newRoute;
}