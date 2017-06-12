import React from 'react';
import {connect} from 'react-redux';
import {Field} from 'core/utils/components/FormComponents';
import {firstLetterLowerCase} from 'core/utils/filters';
import List from './templates/JSONValuesListTemplate';
import ContentEditable from './templates/ContentEditable';
import './JSONValues.scss';
import {formValueSelector, change} from 'redux-form';


const selector = formValueSelector('TabsForm');
@connect((state, {form, config: {target}})=>({
  targetData: selector(state, target),
  routeName: selector(state, target === 'template' ? 'routeName' : 'indexRouteName')
}), {
  change
})
export default class JSONValuesComponent extends React.Component {

  render() {
    const {targetData, routeName, config: {target}} = this.props;
    if(!targetData) return null;
    return (
      <div className="json-values">
        {`${firstLetterLowerCase(routeName)}: {`}
        {this.renderChildren(targetData.i18nKeys, `${target}I18n`)}
        {'}'}
      </div>
    )
  }

  renderChildren(keys, parent) {
    if(!keys) return null;
    const {config: {target}} = this.props;
    const rootValue = {[`${target}I18n`]: this.props.value};
    return keys.map((item, k)=> {
      let value;
      try {
        value = eval(`rootValue.${parent}.${item.name}`);
      } catch(err) {}
      return (
        <div key={k} className="child">
          {this.renderField(item, value, parent, k === keys.length - 1)}
        </div>
      );
    });
  }

  onChange(parentName, name, targetValue) {
    const {change} = this.props;
    change('TabsForm', `${parentName}.${name}`, targetValue);
  }

  renderField(item, value, parent, last) {
    if(item.type === 'object') return (
      <div>
        <span>{item.name}:&nbsp;&#123;</span>
        {this.renderChildren(item.children, `${parent}.${item.name}`)}
        <span>&#125;{!last && ','}</span>
      </div>
    );
    if(item.type === 'list') return (
      <div>
        <span>{item.name}:&nbsp;&#91;</span>
        <List value={value} onChange={targetValue=>this.onChange(parent, item.name, targetValue)}/>
        <span>&#93;{!last && ','}</span>
      </div>
    );
    if(item.type === 'objectList') return (
      <div>
        <span>{item.name}:&nbsp;&#91;</span>
        <List value={value} onChange={targetValue=>this.onChange(parent, item.name, targetValue)} object keys={item.children} parent={`${parent}.${item.name}`} renderField={this.renderField.bind(this)}/>
        <span>&#93;{!last && ','}</span>
      </div>
    );
    return (
      <div className="item">
        <span>{item.name}:&nbsp;"</span>
        <ContentEditable value={value} onChange={e=>this.onChange(parent, item.name, e.target.value)} />
        <span>"{!last && ','}</span>
      </div>
    );
  }

}
