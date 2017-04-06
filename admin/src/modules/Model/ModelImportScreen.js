import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
const XLS = require('xlsx');
import {getJson} from '../../core/utils/ImportService'
import ConfigRow from './templates/Import/ModelImportConfigRow';
import axios from 'axios';
import _ from 'lodash';
import { fieldBuild } from 'core/utils/helpers';
import {I18n} from 'react-redux-i18n';


@connect((state, props)=>({
  importExport: state.main.models[props.params.modelName].structure.importExport,
  modelFields: state.main.models[props.params.modelName].fields,
  modelStructure: state.main.models[props.params.modelName].structure
}))
export default class ModelImportScreen extends React.Component {

  state = {filter: {}};

  render() {
    const {importExport} = this.props;
    const {importItems, sheetName, filter} = this.state;
    return (
      <div>

        <div className="row">
          <div className="col-md-6">

            <div className="margin-bottom-30">
              <h4>1. Select XLS file</h4>
              <input type="file" onChange={this.onFileInputChange.bind(this)} />
            </div>


            {importItems && (
              <div className="margin-bottom-30">
                <h4>2. Select Sheet</h4>
                <select className="form-control" value={sheetName} onChange={e=>this.setState({sheetName: e.target.value})}>
                  <option value="">Select</option>
                  {Object.keys(importItems).map(sheet => (
                    <option key={sheet} value={sheet}>{sheet}</option>
                  ))}
                </select>
              </div>
            )}

            {importItems && sheetName && (
              <div>
                <h4>4. Import</h4>
                <p>There are {importItems[sheetName].length-1} items to be imported</p>
                {importItems[sheetName].length>1 ? (
                  <button className="btn" onClick={this.import.bind(this)}>Import</button>
                ) : (
                  <div className="no-content">There is no data set></div>
                  )}
              </div>
            )}

          </div>

          {importItems && sheetName && (
            <div className="col-md-6">
              <h4>3. Confirm columns</h4>
              <table className="table table-condensed">
                <thead>
                <tr>
                  <th>Field Name</th>
                  <th>Header</th>
                  <th>First row</th>
                  <th>Field config</th>
                </tr>
                </thead>
                <tbody>
                {importExport.map((fieldName, k)=>(
                  <ConfigRow key={k} k={k} fieldName={fieldName} importItems={importItems} sheetName={sheetName}
                             filter={filter} setFilter={this.setFilter.bind(this)} />
                ))}
                </tbody>
              </table>
              {JSON.stringify(filter)}
            </div>
          )}

        </div>

        {this.renderResults()}

      </div>
    )
  }

  renderResults() {
    const {successCount, importStart, importEnd, importItems, sheetName, invalidItems=[]} = this.state;
    return (
      <div>

        {successCount!=null && (
          <div>
            <h4>5. Results</h4>
            <p>{successCount/(importItems[sheetName].length-1)*100}% items imported ({successCount}/{importItems[sheetName].length-1})</p>
            {importStart && importEnd && (
              <p>Import finished in {(importEnd-importStart)/1000}s</p>
            )}
          </div>
        )}

        {!!invalidItems.length && (
          <div className="margin-top-40">
            <h4>6. Errors</h4>
            <p>{(invalidItems.length/(importItems[sheetName].length-1)*100).toFixed(2)}% items failed to import ({invalidItems.length}/{importItems[sheetName].length-1})</p>
            <ul>
              {invalidItems.map((item, k)=>(
                <li key={k}>
                  <span>{k+1+'.'}</span>
                  <strong>{item.name}</strong>
                  {Object.keys(item.errors).map(fieldName=>(
                    <span key={fieldName}> {item.errors[fieldName].map(error=>`[${fieldName}]=${error}`).join(',')}</span>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  onFileInputChange(e) {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = e => {
      const results = getJson(XLS.read(e.target.result, {type:'binary'}));
      this.setState({importItems: results});
      if(Object.keys(results).length) {
        this.setState({sheetName: Object.keys(results)[0]});
      }
      // console.log('results', results); // TODO: remove
    };
  }

  setFilter(key, value) {
    const {filter} = this.state;
    this.setState({
      filter: {
        ...filter,
        [key]: value
      }
    });
  }


  import() {

    // 1. Parse Import Items
    const allItems = this.parseImportItems();
    this.setState({invalidItems: [], successCount: 0, importStart: moment().format('x'), importEnd: null}); // reset

    // 2. Build fields
    this.buildFields(allItems, () => {

      // 3. Pre-validate
      this.preValidate(allItems, (allItems, invalidItems) => {
        this.setState({invalidItems});
        // console.log('invalidItems', invalidItems)
        // console.log('allItems', allItems)


        // 4. Get submodels (categories)
        this.getCategories(allItems, () => {

          console.log('allItems', allItems)

          // 5. Import items (sending chunks)
          this.perChunk = 100;
          this.page = 0;
          this.sendChunk(allItems);

        });

      });

    });


  }



  /**
   * PARSE IMPORT ITEMS
   * parses xls data format to importable data format
   */
  parseImportItems() {
    const {modelFields, modelStructure} = this.props;
    const {importItems, sheetName, filter} = this.state;

    const newItems = [];

    // parse from xls
    importItems[sheetName].forEach(function (itemArray, i) {
      if(i==0) return; // ignore the first row
      const newItem = {};
      itemArray.forEach(function(item, k) {
        newItem[modelStructure.importExport[k]] = item;
      });
      newItems.push(newItem);
    });

    // parse dates; todo: remove hardcoding
    newItems.forEach(function(item) {
      if(modelFields.startDate) {
        const startDateFormat = filter.dateFormat;
        item.startDate = moment(item.startDate, startDateFormat).toDate();
      }
      if(modelFields.endDate) {
        const endDateFormat = filter.dateFormat;
        item.endDate = moment(item.endDate, endDateFormat).toDate();
      }
      if(modelFields.startTime) {
        const startTimeFormat = filter.timeFormat;
        item.startTime = moment(item.startTime, startTimeFormat).toDate();
      }
      if(modelFields.endTime) {
        const endTimeFormat = filter.timeFormat;
        item.endTime = moment(item.endTime, endTimeFormat).toDate();
      }
    });

    return newItems;
  };



  /**
   * BUILD FIELDS
   * builds fields based on config
   */
  buildFields(items, cb) {
    const {modelFields, params: {modelName}} = this.props;

    // get buildable fields
    const buildableFields = {};
    _.forEach(modelFields, function(data, fieldName) {
      if(data.config.edit.build) buildableFields[fieldName] = data.config.edit.build;
    });

    // build fields for each item
    items.forEach(function(item) {
      _.forEach(buildableFields, function(build, fieldName) {
        item[fieldName] = fieldBuild(item, build);
      })
    });

    cb();
  };



  /**
   * PREVALIDATOR
   * validates fields not to go to final import save
   */
  preValidate(items, cb) {

    const {modelFields, params: {modelName}} = this.props;
    const validItems = [];
    const newItems = [];
    const invalidItems = [];

    // get unique fields
    const uniqueFields = {};
    const submodelFields = {};
    _.forEach(modelFields, function(data, fieldName) {
      if(data.validation.unique && fieldName!='id') uniqueFields[fieldName] = [];
      else if(data.validation.model && !data.config.importExport.createIfNotFound) submodelFields[fieldName] = [];
      if(uniqueFields[fieldName] || submodelFields[fieldName] || data.validation.required) items.forEach(function(item) {
        if(data.validation.required && !item[fieldName]) {
          item.errors = item.errors || {};
          item.errors[fieldName] = item.errors[fieldName] || [];
          item.errors[fieldName].push('required');
          if(Object.keys(item.errors).length==1) invalidItems.push(item);
        } else {
          if(uniqueFields[fieldName]) {
            if(uniqueFields[fieldName].indexOf(item[fieldName])==-1) {
              uniqueFields[fieldName].push(item[fieldName]);
              if(!item.added) {
                item.added = true;
                validItems.push(item);
              }
            } else {
              item.errors = item.errors || {};
              item.errors[fieldName] = item.errors[fieldName] || [];
              item.errors[fieldName].push('duplicate');
              if(Object.keys(item.errors).length==1) invalidItems.push(item);
            }
          } else if(submodelFields[fieldName]) {
            if(submodelFields[fieldName].indexOf(item[fieldName])==-1) submodelFields[fieldName].push(item[fieldName]);
            if(!item.added) {
              item.added = true;
              validItems.push(item);
            }
          }
        }
      });
    });
    // console.log('invalidItems', [...invalidItems]);

    // check for duplicate on server
    axios.post('/import/check', {model: modelName, unique: uniqueFields, submodel: submodelFields}).then(function(response) {
      // console.log('response check', response);
      validItems.forEach(function(item) {
        item.errors = {};
        _.forEach(response.data.unique, function(fieldItems, fieldName) {
          if(response.data.unique[fieldName].indexOf(item[fieldName])>-1) {
            item.errors[fieldName] = item.errors[fieldName] || [];
            item.errors[fieldName].push('unique');
          }
        });
        _.forEach(response.data.submodel, function(fieldItems, fieldName) {
          if(response.data.submodel[fieldName].indexOf(item[fieldName])>-1) {
            item.errors[fieldName] = item.errors[fieldName] || [];
            item.errors[fieldName].push('notFound');
          }
        });
        if(!Object.keys(item.errors).length) newItems.push(item);
        else invalidItems.push(item);
      });

      // console.log('newItems', newItems);
      // console.log('invalidItems', invalidItems);
      cb(newItems, invalidItems);
    });

  };



  /**
   * GET CATEGORIES
   * get all items categories from database by slug
   * if the category does not exist, it creates it in backend
   */
  getCategories(items, cb) {
    const {modelFields} = this.props;

    // 1. Get submodel fields
    const submodelFields = {};
    _.forEach(modelFields, function(field, fieldName) {
      if(field.validation.model) {
        submodelFields[fieldName] = {
          createIfNotFound: field.config.importExport.createIfNotFound,
          parent: field.config.importExport.parent,
          fieldName: field.config.importExport.selectedField,
          model: field.validation.model,
          items: []
        };
      }
    });


    // 2. Get submodel field values
    _.forEach(submodelFields, function(v, fieldName) {
      items.forEach(function(item) {
        if(item[fieldName] && submodelFields[fieldName].items.indexOf(item[fieldName])==-1) submodelFields[fieldName].items.push(item[fieldName]);
      });
    });


    // 3. Get category objects form server and populate submodels
    //console.log('submodelFields', submodelFields);
    axios.post('/import/getCategoryObjects', submodelFields).then(function(response) {
      const categoryObjects = response.data;
      items.forEach(function(item) {
        _.forEach(categoryObjects, function(fieldItems, fieldName) {
          fieldItems.forEach(function(fieldItem) {
            if(fieldItem && item[fieldName] == fieldItem[submodelFields[fieldName].fieldName]) item[fieldName] = fieldItem;
          });
        });
      });
      cb();
    });
  };


  /**
   * SEND DATA CHUNK
   */
  sendChunk(allItems) {
    const {params: {modelName}} = this.props;
    const start = this.page * this.perChunk;
    const end = (this.page+1) * this.perChunk;
    const chunkItems = allItems.slice(start, end);
    // console.log('chunkItems', chunkItems);
    axios.post(`/${modelName}/import`, {items: chunkItems}).then(response => {
      // console.log('response', response);
      this.setState({successCount: this.state.successCount + response.data.successCount});
      this.page++;
      if(allItems[this.page * this.perChunk]) setTimeout(this.sendChunk, 1000, allItems);
      else this.importEnd = moment().format('x');
    }).catch(err => {
      console.log('err', err);
    })
  }


}
