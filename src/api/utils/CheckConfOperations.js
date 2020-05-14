/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import _ from 'lodash';

/********
 * Operation struct: 
 * 
 *  ID         int64                  `json:"id"`
 *	Type       string                 `json:"type"`
 *	ParentID   int64                  `json:"parent_id"`
 *	ParentType string                 `json:"parent_type"`
 *	PartID     int64                  `json:"part_id"`
 *	PartType   string                 `json:"part_type"`
 *	DocID      int64                  `json:"doc_id"`
 * 	DocType    string                 `json:"doc_type"`
 *	Data       map[string]interface{} `json:"data"`
 * 
 */

/** //TOASK
 * 
 * ? - Is PartID and PartType are required fields in the operation object?
 * 
 * 
 */

const operationKeys = [ 'ID', 'Type', 'ParentID', 'ParentType', /*'PartID', 'PartType',*/ 'DocID', 'DocType', 'Data'];

const checkOperation = ( operation ) => {
    const o = {};

    if ( operation && _.isObject(operation)) {
        _.forEach(operationKeys, (key) => {
            if (key in operation) {
                o[key] = operation[key];
            } else {
                throw new Error(`missing mandatory field ${key}`);
            }
        });
    } else {
        throw new Error(`operation wrong specified: ${operation}`);
    }

    return o;
};

export default (operations) => {
    const ops = [];

    if (operations) {
        if (_.isArray(operations)) {
            _.forEach(operations, (operation, i) => {
                try { 
                    const o =  checkOperation(operation);
                    ops.push(o);
                } catch (e) {
                    throw new Error(`Operation ${i} error: ${e}`);
                }
            });
        } else {
            throw new Error('Operations must be an array'); // операции должны быть массивом
        }

    } else {
        throw new Error('Operations are not specified.'); // операции пустые
    }

    return ops;
};