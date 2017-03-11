import React from 'react';
import {connect} from 'react-redux';
import {getList} from '../../ModelActions';
import moment from 'moment';


@connect((state, props)=>({
  importExport: state.main.models[state.main.params.modelName].structure.importExport,
  modelFields: state.main.models[state.main.params.modelName].fields,
  list: state.model.list
}), {
  getList
})
export default class ModelImportConfigRow extends React.Component {

  timeFormatList = [
    {display: '19:00', value: 'H:mm'},
    {display: '7:00PM', value: 'h:mmA'},
    {display: '07PM', value: 'hhA'}
  ];

  dateFormatList = [
    {display: moment().format('MM/DD/YYYY'), value: 'MM/DD/YYYY'},
    {display: moment().format('M/D/YY'), value: 'M/D/YY'},
    {display: moment().format('DD.MM.YYYY'), value: 'DD.MM.YYYY'},
    {display: moment().format('D.M.YY'), value: 'D.M.YY'},
    {display: moment().format('YYYYMMDD'), value: 'YYYYMMDD'}
  ];

  componentWillMount() {
    const {modelFields, fieldName, getList, importItems, sheetName, setFilter} = this.props;
    const config = modelFields[fieldName].config.importExport;
    if(config.parent) getList(config.parent.model);

    // auto find template
    if(importItems[sheetName].length>1) {
      if(['date', 'time'].includes(config.template)) {
        const formatList = this[config.template=='time' ? 'timeFormatList' : 'dateFormatList'].map(i=>i.value);
        const defaultValue = moment(importItems[sheetName][1][fieldName], formatList).creationData().format;
        if(defaultValue) {
          console.log('defaultValue', config.template=='time' ? 'timeFormat' : 'dateFormat', defaultValue)
          setTimeout(()=>{
            setFilter(config.template=='time' ? 'timeFormat' : 'dateFormat', defaultValue)
          })
        }
      }
    }

  }
  render() {
    const {fieldName, importItems, sheetName, k} = this.props;
    return (
      <tr key={fieldName}>
        <td>{fieldName}</td>
        <td>{importItems[sheetName][0][k] || 'No header'}</td>
        <td>{importItems[sheetName][1][k] || 'No data'}</td>
        <td>{this.renderConfig()}</td>
      </tr>
    )
  }
  renderConfig() {
    const {modelFields, list, fieldName, filter, setFilter} = this.props;
    const config = modelFields[fieldName].config.importExport;

    if(config.parent && list[config.parent.model]) {
      return (
        <select value={filter.parent.object} onChange={e=>console.log('e', e.target)}>
          <option value="" disabled>-- Select --</option>
          {list[config.parent.model].map((item, k)=>(
            <option key={k} value={k}>{item.name}</option>
          ))}
        </select>
      )
    } else if(config.template == 'date') {
      return (
        <select value={filter.dateFormat} onChange={e=>setFilter('dateFormat', e.target.value)}>
          <option value="" disabled={filter.dateFormat}>-- Select --</option>
          {this.dateFormatList.map((item, k)=>(
            <option key={k} value={item.value}>{item.display}</option>
          ))}
        </select>
      )
    } else if(config.template == 'time') return (
      <select value={filter.timeFormat} onChange={e=>setFilter('timeFormat', e.target.value)}>
        <option value="" disabled={filter.dateFormat}>-- Select --</option>
        {this.timeFormatList.map((item, k)=>(
          <option key={k} value={item.value}>{item.display}</option>
        ))}
      </select>
    )
  }
}
