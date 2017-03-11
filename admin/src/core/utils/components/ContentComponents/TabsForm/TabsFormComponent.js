import React from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import {SubmitButton, ResetButton, ReturnButton} from 'FormComponents';
import {Tabs, Tab} from 'react-bootstrap';
import {Validate} from '../../FormComponents';


/**
 * Tabs Form Component
 * @description Creates a Redux From with a Tab Set and creates validation for each tab
 * @prop:validate The validation function used be Redux Form
 * @prop:list The list of Tabs
 * @prop:onSubmit The onSubmit function used when clicking on Submit Button
 */
@connect(state=>({
  tabListErrors: state.form.TabsForm && state.form.TabsForm.syncErrors && state.form.TabsForm.syncErrors.tabList
}))
@reduxForm({
  form: 'TabsForm',
  validate: (values, props) => {
    if(props.validationRules) return Validate(props.validationRules)(values);
  },
  shouldValidate: ({values, props}) => {
    if(props.onChangeBuild) props.onChangeBuild(values);
    return true;
  }
})
export default class TabsForm extends React.Component {

  renderTab(item, k) {
    const {tabListErrors, submitFailed} = this.props;
    const isInvalid = tabListErrors && tabListErrors[k];
    const tabName = isInvalid && submitFailed ?
      <span>{item.name}<i className="tf-invalid fa fa-exclamation"/></span> : item.name;
    return <Tab key={k} eventKey={k} title={tabName}>{item.component}</Tab>
  }

  render() {
    const {handleSubmit, onSubmit, reset, getLoading, saveLoading, list, returnRoute } = this.props;
    const tabId = this._reactInternalInstance._debugID;
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={saveLoading}>
          <Tabs defaultActiveKey={0} id={tabId} className="admin-container">
            { list.map(this.renderTab.bind(this)) }
          </Tabs>
        </fieldset>
        <div className="nav-tab-btn-container">
          <ReturnButton route={returnRoute} />
          <ResetButton reset={reset} />
          <SubmitButton loading={saveLoading}>Save</SubmitButton>
        </div>
        { getLoading && <Loader /> }
      </form>
    )
  }

}
