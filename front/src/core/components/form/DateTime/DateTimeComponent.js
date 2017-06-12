import React from 'react';
import moment from 'moment';
import Datetime from 'react-datetime';


export default class DateTimeComponent extends React.Component {
  render() {
    const { disableDatesBefore, disableDatesAfter, onChange, value } = this.props;
    const validAfterAndBefore = function (current) {
      let isValidAfter = true;
      let isValidBefore = true;
      if (disableDatesBefore) {
        isValidAfter = current.isAfter(moment(disableDatesBefore).subtract(1, 'Days'));
      }
      if (disableDatesAfter) {
        isValidBefore = current.isBefore(disableDatesAfter);
      }
      return isValidAfter && isValidBefore;
    };
    return (
      <div>
        <Datetime value={value} dateFormat='DD/MM/YYYY'
                  closeOnSelect={true}
                  onChange={param => onChange(param.toDate())}
                  inputProps={{className: 'form-field'}}
                  isValidDate={validAfterAndBefore}/>
      </div>
    )
  }
}