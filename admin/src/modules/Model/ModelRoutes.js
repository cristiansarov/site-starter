import Model from './ModelModule';
import ModelList from './ModelListScreen';
import ModelEdit from './ModelEditScreen';
import ModelImport from './ModelImportScreen';

export default {
  path: 'model/:modelName',
  name: 'Model',
  component: Model,
  indexRoute: {
    name: 'ModelList',
    component: ModelList
  },
  childRoutes: [
    {
      path: 'add',
      name: 'ModelAdd',
      component: ModelEdit
    },
    {
      path: 'import',
      name: 'ModelImport',
      component: ModelImport
    },
    {
      path: ':modelId',
      name: 'ModelEdit',
      component: ModelEdit
    }
  ]
}
