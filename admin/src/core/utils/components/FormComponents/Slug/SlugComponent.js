import React from 'react';
import {connect} from 'react-redux';
import {evalState} from 'core/utils/helpers';
import './Slug.scss';


@connect((state, props)=>({
  parentSlug: evalState(`state.form.${props.form}.values.parent.slug`, state)
}))
export default class SlugComponent extends React.Component {
  render() {
    const {parentSlug, value, form} = this.props;
    return (
      <div className="form-slug">
        <div>
          {window.location.origin}/{parentSlug && `${parentSlug}/`}
        </div>
        <div>
          <input type="text" value={value} onChange={this.onChange.bind(this)} />
        </div>
      </div>
    )
  }
  onChange(e) {
    const value = e.target.value;
    var regex = /^[A-Za-z0-9\-\/\:]+$/;
    const isValid = !value || regex.test(value);
    if(isValid) this.props.onChange(e);
    else e.preventDefault();
  }
}
