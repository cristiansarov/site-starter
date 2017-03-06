/**
 *
 */
module.exports = function(req) {

    /**
     * General variables
     */
    var $q = require('q');
    var actionUtil = require('./actionUtil');
    var parseParamsDefer = $q.defer();
    var values = actionUtil.parseValues(req);
    var modelName = values.model.toLowerCase();
    var Model = req._sails.models[modelName];
    var modelData = actionUtil.getParsedModelData(Model)
    var modelConfig = modelData.config;
    var modelFields = modelData.fields;
    var currentLocale = values.locale || actionUtil.getCurrentLocale(req);
    var params = {};


    return {

        /**
         * Generate basic params
         */
        generateBasicParams: function (params) {
            var perPage = values.perPage || modelConfig.perPage;
            var page = values.page || 1;
            params.limit = values.limit || perPage;
            params.skip = values.skip || (perPage * (page - 1));
            if(params.fields) params.select = _.clone(params.fields);
            if(values.sort) params.sort = values.sort;
            params.where = actionUtil.parseCriteria(req);
            delete params.where.model;
            delete params.where.locale;
            return params;
        },


        /**
         * Get submodel fields list
         * @businessType List Getter
         * @example [ { attr: 'modelFieldName', model: 'modelname', via: 'associationField' } ]
         * */
        getSubmodelFields: function(modelName) {
            var Model = req._sails.models[modelName];
            var modelFields = actionUtil.getParsedModelData(Model).fields;
            var submodelFields = {};
            _.forEach(modelFields, function (data, fieldName) {
                if (data.validation.collection) submodelFields[fieldName] = data.validation;
            });
            return submodelFields;
        },


        /**
         * Get i18n fields list
         * @businessType List Getter
         * @example [ { attr: 'modelFieldName', model: 'modelname', via: 'associationField' } ]
         * */
        getI18nFields: function(modelName) {
            var I18nModel = req._sails.models[modelName+'i18n'];
            if(!I18nModel) return {};
            var i18nModelFields = actionUtil.getParsedModelData(I18nModel).fields;
            var i18nFields = {};
            _.forEach(i18nModelFields, function (data, fieldName) {
                if(['id', 'locale', 'i18nParent', 'createdAt', 'updatedAt'].indexOf(fieldName)==-1) {
                    i18nFields[fieldName] = data.validation;
                }
            });
            return i18nFields;
        },


        /**
         * Get filtered i18n params
         * @businessType Filterer
         * @example [ { attr: 'modelFieldName', model: 'modelname', via: 'associationField' } ]
         * */
        getFilteredI18nParams: function(params, list) {
            var filteredParams = {};
            _.forEach(params, function (value, name) {
                if(list[name]) {
                    filteredParams[name] = _.clone(params[name]);
                    delete params[name];
                } else if(name.indexOf('.')>-1) {
                    var assoc = name.split('.')
                    if (list[assoc[0]]) {
                        filteredParams[name] = _.clone(params[name]);
                        delete params[name];
                    }
                }
            });
            return filteredParams;
        },


        /**
         * Get filtered params
         * @businessType Filterer
         * @example [ { attr: 'modelFieldName', model: 'modelname', via: 'associationField' } ]
         * */
        getFilteredParams: function(params, list) {
            var filteredParams = {};
            _.forEach(params, function (value, name) {
                if(name.indexOf('.')>-1) {
                    var assoc = name.split('.');
                    if (list[assoc[0]] && assoc[1]) {
                        filteredParams[name] = _.clone(params[name]);
                        delete params[name];
                    }
                }
            });
            return filteredParams;
        },

        getFilteredParams2: function(params, list) {
            var filteredParams = {};
            _.forEach(params, function (value, name) {
                if(name.indexOf('.')>-1) {
                    var assoc = name.split('.');
                    if (list[assoc[1]]) {
                        filteredParams[assoc[1]] = _.clone(params[name]);
                        delete params[name];
                    }
                }
            });
            return filteredParams;
        },


        getCommonIds: function(array) {
            var commonIds = array.shift().filter(function(v) {
                return array.every(function(a) {
                    return a.indexOf(v) !== -1;
                });
            });
            return commonIds;
        },


        /**
         * Get Associated Submodel id list
         * @returns {Array}
         * @example [ 1, 2, 3 ]
         */
        getModelIdsFromSubmodelParams: function (where, associationList) {
            var defer = $q.defer();

            /**
             * GET ALL NEEDED ASSOCIATIONS
             * @type {Array}
             * @example [ { attr: 'modelFieldName', model: 'modelname', via: 'associationField', where: { subModelFieldName: 'subModelFieldValue' } } ]
             * */
            var neededAssociations = [];
            var filteredIds = [];
            _.forEach(where, function (value, field) {
                _.forEach(associationList, function (item, attr) {
                    if (field.indexOf(attr) == 0) {
                        delete where[field];
                        var data = field.split('.');
                        if (data.length == 2) {
                            item.where = {};
                            item.where[data[1]] = value;
                            neededAssociations.push(item);
                        }
                    }
                });
            });


            /**
             * IF THERE ARE ASSOCIATIONS, GET ALL SUBMODEL IDS THAT FILTER THE MAIN MODEL
             */
            if (neededAssociations.length) {
                _.forEach(neededAssociations, function (data) {
                    var Submodel = sails.models[data.collection];
                    var params = {
                        where: data.where,
                        select: ['id'],
                        limit: 1
                    };
                    Submodel.find(params).populate(data.via).exec(function (err, list) {
                        _.forEach(list, function (item) {
                            _.forEach(item[data.via], function (item) {
                                filteredIds.push(item.id);
                            })
                        });
                        defer.resolve({model: data.collection, ids: filteredIds});
                    });
                });
            } else defer.resolve();

            return defer.promise;
        },



        /**
         * Get Submodels id list from associated I18n fields
         * @returns {Array}
         * @example [ 1, 2, 3 ]
         */
        getModelIdsFromModelI18nParams: function (where, modelName) {

            var defer = $q.defer();
            var i18nModelName = modelName + 'i18n';
            var I18nModel = req._sails.models[i18nModelName];
            var i18nIds = [];


            // If there are i18n fields, resolve the ids, else resolve undefined
            if (Object.keys(where).length) {
                where.locale = currentLocale;
                var params = {where: where, select: ['i18nParent']};
                //console.log('i18nModelName', i18nModelName)
                //console.log('zaParams', params)
                I18nModel.find(params).exec(function (err, list) {
                    if (err) defer.reject(err);
                    //console.log('list', list)
                    _.forEach(list, function (item) {
                        i18nIds.push(item.i18nParent);
                    });
                    defer.resolve({model: i18nModelName, ids: i18nIds});
                    //console.log('filteredI18nS', i18nIds)
                });
            } else defer.resolve();

            return defer.promise;
        },


        /**
         * Get the parsed params
         * 1. Model i18n --> Model ids
         * 2. Submodel params --> Model ids
         * 3. Submodel params with i18n --> Submodel ids --> Model ids
         * 4. Model basic params
         */
        get: function(cb) {

            // Generate basic params structure
            params = this.generateBasicParams(params);
            var $this = this;

            //console.log('params', params);
            // If where property has no data return basic params
            if (!params.where || !Object.keys(params.where).length) return cb(params);


            /**
             * Separate i18n params from regular ones with the i18n field list
             */
            var i18nModelFields = $this.getI18nFields(modelName);
            var i18nModelParams = $this.getFilteredI18nParams(params.where, i18nModelFields);


            /**
             * Separate submodel params from regular ones with the submodel field list
             */
            var submodelFields = $this.getSubmodelFields(modelName);
            var submodelParams = $this.getFilteredParams(params.where, submodelFields);


            /**
             * For each submodel param, get the submodel i18n params into the i18nParams object
             */
            var i18nSubmodelFields = {};
            var i18nSubmodelParams = {};
            _.forEach(submodelParams, function(value, name) {
                var submodelCollection = name.split('.')[0];
                var submodelField = name.split('.')[1];
                var submodelName = submodelFields[submodelCollection].collection;
                i18nSubmodelFields[submodelName] = $this.getI18nFields(submodelName);
                i18nSubmodelParams[submodelName] = _.extend((i18nSubmodelParams[submodelName]||{}), $this.getFilteredParams2(submodelParams, i18nSubmodelFields[submodelName]));
            });

            //console.log('params', params)
            //console.log('i18nModelParams', i18nModelParams)
            //console.log('submodelParams', submodelParams)
            //console.log('i18nSubmodelParams', i18nSubmodelParams)


            /**
             * STARTING GENERATING ARRAYS OF ID ARRAYS
             * Submodel params --> Model ids
             */
            var modelPromises = [];
            if(Object.keys(submodelParams).length) modelPromises.push($this.getModelIdsFromSubmodelParams(submodelParams, submodelFields));


            /**
             * Model params with i18n --> Model ids
             */
            if(Object.keys(i18nModelParams).length) modelPromises.push($this.getModelIdsFromModelI18nParams(i18nModelParams, modelName));


            /**
             * Submodel params with i18n --> Submodel ids
             */
            var submodelPromises = [];
            if(Object.keys(i18nSubmodelParams).length) _.forEach(i18nSubmodelParams, function(i18nSubmodelParamsItem, modelName) {
                submodelPromises.push($this.getModelIdsFromModelI18nParams(i18nSubmodelParamsItem, modelName));
            });


            /**
             * Wait for promises that have submodels or model's i18n, and then get those parent
             */
            var modelIds = [];
            var firstModelIdConversionDefer = $q.defer();
            if(modelPromises.length) $q.all(modelPromises).then(function(data) {
                data.forEach(function(item) {
                    if(!item) return;
                    modelIds.push(item.ids);
                });
                firstModelIdConversionDefer.resolve();
            });
            else firstModelIdConversionDefer.resolve();


            /**
             * Wait for promises that have submodels i18n, and then get those parent
             */
            var submodelIds = {};
            var submodelDefer = $q.defer();
            var lastModelIdConversion = $q.defer();

            if(submodelPromises.length) $q.all(submodelPromises).then(function(data) {
                //console.log('data', data)
                data.forEach(function(item) {
                    if(!item) return;
                    if(!submodelIds[item.model]) submodelIds[item.model] = [];
                    submodelIds[item.model].push(item.ids);
                });
                submodelDefer.resolve();
            });
            else submodelDefer.resolve();


            /**
             * Submodel ids -> model ids
             */
            submodelDefer.promise.then(function() {
                var submodelIdsPromises = [];
                var assocField = [];
                _.forEach(submodelIds, function(ids, submodelName) {
                    var modelName = submodelName.replace('i18n', '');

                    // find what field assoc has with parent
                    var populateField = '';
                    _.forEach(submodelFields, function(data) {
                        if(data.collection==modelName) populateField = data.via;
                    });

                    var commonIds = $this.getCommonIds(ids);

                    if(commonIds.length && populateField) {
                        assocField.push(populateField);
                        submodelIdsPromises.push(req._sails.models[modelName].find({where: {id: commonIds}}).populate(populateField));
                    } else {
                        submodelIdsPromises.push($q.defer().resolve([]).promise)
                    }
                });

                $q.all(submodelIdsPromises).then(function(data) {
                    data.forEach(function(data, k) {
                        var idArray = [];
                        data.forEach(function(item) {
                            item[assocField[k]].forEach(function(item) {
                                idArray.push(item.id);
                            });
                        });
                        modelIds.push(idArray);
                    });
                    lastModelIdConversion.resolve();
                });
            });

            /**
             * Get common IDS from all arrays
             */
            $q.all([firstModelIdConversionDefer.promise, lastModelIdConversion.promise]).then(function(data) {

                //console.log('finalModelIds', modelIds)

                if(!modelIds.length) return cb(params);

                params.where.id = $this.getCommonIds(modelIds);

                //console.log('params', params);

                return cb(params);

            });

        }
    }

};