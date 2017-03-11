import React from 'react';
import {connect} from 'react-redux';
import {getPagedList, resetPagedList, deleteItems} from './ModelActions'
import {Link} from 'react-router';
import DefaultList from './templates/defaultList/ModelDefaultListTemplate';
import ImageList from './templates/imageList/ModelImageListTemplate';
import {getModelPrimaryKey} from 'helpers';


@connect((state, props)=>({
  list: state.model.pagedList[props.params.modelName],
  loading: state.model.listLoading,
  models: state.main.models,
}), {
  getPagedList,
  resetPagedList,
  deleteItems
})
export default class ModelListScreen extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };
  state = {checked: {}};
  componentWillMount() {
    const {params: {modelName}} = this.props;
    this.modelName = modelName;
    this.getPagedList();
    this.unlistenRouteChange = this.context.router.listen(location=>{
      if(this.props.location.query != location.query) {
        setTimeout(()=>{
          if(this.modelName) this.getPagedList(this.modelName);
        });
      }
    })
  }
  getPagedList() {
    const {location: {query}, getPagedList} = this.props;
    getPagedList(this.modelName, query);
  }
  render() {
    const {loading, models} = this.props;
    const checked = this.state.checked;
    const listTemplate = models[this.modelName].config.list.template;
    return (
      <div>

        <h2>List {listTemplate}</h2>

        {listTemplate == 'image' ? (
          <ImageList checked={checked} modelName={this.modelName} getList={this.getPagedList.bind(this)} checkAll={this.checkAll.bind(this)} checkOne={this.checkOne.bind(this)} />
        ) : (
          <DefaultList checked={checked} modelName={this.modelName} getList={this.getPagedList.bind(this)} checkAll={this.checkAll.bind(this)} checkOne={this.checkOne.bind(this)} deleteItems={this.deleteItems.bind(this)} />
        )}

        { loading && (
          <div>
            Loading...
          </div>
        ) }

      </div>
    )
  }
  checkOne(index, checked) {
    const newChecked = {...this.state.checked};
    if(checked) {
      newChecked[index] = true;
    } else {
      delete newChecked[index];
    }
    this.setState({checked: newChecked});
  }
  checkAll() {
    const {list} = this.props;
    let newChecked = {};
    if(Object.keys(this.state.checked).length!=list.length) {
      list.forEach((i, k)=>newChecked[k]=true);
    }
    this.setState({checked: newChecked});
  }
  deleteItems() {
    const {list, deleteItems, params: {modelName}} = this.props;
    const userIds = Object.keys(this.state.checked).map(index=>list[index][getModelPrimaryKey(modelName)]);
    deleteItems(this.modelName, userIds).then(()=>{
      this.setState({checked: {}});
      this.getPagedList();
    });
  }
  componentWillUnmount() {
    this.unlistenRouteChange();
    this.props.resetPagedList();
    this.modelName = null;
  }
}
