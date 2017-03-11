import React from 'react';
import {connect} from 'react-redux';
import {initialize, stopAsyncValidation} from 'redux-form';
import {TabsForm, toastr} from '../../core/utils/components/ContentComponents';
import EditTab from './templates/ModelEditTabTemplate';
import { generateValidationErrors, formFieldBuild, getModelPrimaryKey } from 'helpers';
import {I18n} from 'react-redux-i18n';
import {
  getItem,
  createItem,
  updateItem,
  getList
} from './ModelActions';


@connect(state=>({
  models: state.main.models,
  item: state.model.item
}), {
  getItem,
  createItem,
  updateItem,
  getList,
  initialize,
  stopAsyncValidation
})
export default class ModelEditScreen extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };
  componentWillMount() {
    this.getSubmodels();
    this.handleAddMode();
  }
  render() {
    const {models, params: {modelName}} = this.props;
    if(!models) return null;
    const list = models[modelName].structure.edit.map(item=>{
      const fields = item.fields.map(fieldName=>{
        return {
          ...models[modelName].fields[fieldName].config.edit,
          name: fieldName
        }
      });
      return {
        name: I18n.t(`tab.${item.tabName||'details'}`),
        component: <EditTab fields={fields} />
      }
    });
    const validationRules = {};
    models[modelName].structure.edit.forEach(item=>{
      item.fields.forEach(fieldName=>{
        validationRules[fieldName] = models[modelName].fields[fieldName].validation;
      });
    });
    return (
      <div className="model-edit">
          <TabsForm list={list} onSubmit={this.onSubmit.bind(this)} validationRules={validationRules}
                    returnRoute={{name: 'ModelList', params: {modelName}}}
                    onChangeBuild={this.onChangeBuild.bind(this)}/>
      </div>
    )
  }
  componentDidUpdate(prevProps) {
    this.getSubmodels();
    if(prevProps.params.modelId!=this.props.params.modelId) {
      this.handleAddMode();
    }
  }
  handleAddMode() {
    const {params: {modelName, modelId}, getItem, initialize} = this.props;
    this.addMode = !modelId;
    if(!this.addMode) getItem(modelName, modelId).then(response=>{
      initialize('TabsForm', response.value.data);
    })
  }
  getSubmodels() {
    const {models, params: {modelName}, getList, list} = this.props;
    if(models && !this.gotSubmodels) {
      this.gotSubmodels = true;
      const submodels = [];
      models[modelName].structure.edit.forEach(item=>{
        item.fields.forEach(fieldName=>{
          const model = models[modelName].fields[fieldName].config.edit.model;
          if(model && !submodels.includes(model)) submodels.push(model);
        });
      });
      submodels.forEach(submodel=>{
        getList(submodel);
      });
    }
  }
  onSubmit(formData) {
    const {params: {modelName}, createItem, updateItem, initialize, stopAsyncValidation, item} = this.props;
    const catchErr = (err)=>{
      stopAsyncValidation('TabsForm', generateValidationErrors(err.message.invalidAttributes));
    };
    const modelPK = getModelPrimaryKey(modelName);
    if(this.addMode) {
      createItem(modelName, formData).then(response=>{
          toastr.success('Created successfully');
          this.context.router.push({name: 'ModelEdit', params: {modelName, modelId: response.value.data[modelPK]}})
      }).catch(catchErr);
    } else {
      updateItem(modelName, item[modelPK], formData).then(response=>{
        toastr.success('Updated successfully');
        if(item[modelPK]!=formData[modelPK]) {
          this.context.router.push({name: 'ModelEdit', params: {modelName, modelId: response.value.data[modelPK]}})
        } else initialize('TabsForm', response.value.data)
      }).catch(catchErr);
    }
  }
  onChangeBuild(values) {
    const {models, params: {modelName}} = this.props;
    if(models) {
      const buildableFields = [];
      models[modelName].structure.edit.forEach(item=>{
        item.fields.forEach(fieldName=>{
          const build = models[modelName].fields[fieldName].config.edit.build;
          if(build) buildableFields.push({...build, fieldName})
        });
      });
      buildableFields.forEach(build=>{
        formFieldBuild('TabsForm', build, values)
      });
    }
  }
}
