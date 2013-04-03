function objectify(models, model, visitedList, vault, deepth)
{
    if(visitedList[model] == 'visited' )
    {
        return null;
    }

    var simpleTypes = {
        string: '',
        int: 0,
        byte: 0,
        long: 0,
        float: 0,
        double: 0,
        boolean: false,
        Date: new Date("1970-01-01T00:00:00.000+0000")
    };

    var mod = models[model];
    var obj = {};

    if(mod != undefined)
    {
        var modType = mod.type;
        var modelProperties = mod.properties;
        for(var property in modelProperties)
        {
            var propertyType = modelProperties[property].type;
            if(simpleTypes[propertyType] != undefined)
            {
                if(modType == 'enum')
                {
                    obj[property] = modelProperties[property].value;
                }
                else
                {
                    obj[property] = simpleTypes[propertyType];
                }
            }
            else
            {
                if(modType == 'List' || propertyType == 'List')
                {
                    if(vault[property] == undefined)
                    {
                        deepth++;
                        visitedList[model] = 'visited';
                        var tmpObj = objectify(models, modelProperties[property].items.$ref, visitedList, vault, deepth);
                        obj[property] = [tmpObj];
                        delete visitedList[model];
                        vault[property] = obj[property];
                    }
                    else
                    {
                        obj[property] = vault[property];
                    }
                }
                else
                {
                    if(vault[property] == undefined)
                    {
                        deepth++;
                        visitedList[model] = 'visited';
                        obj[property]  = objectify(models, propertyType, visitedList, vault, deepth);
                        delete visitedList[model];
                        vault[property] = obj[property];
                    }
                    else
                    {
                        obj[property] = vault[property];
                    }
                }
            }
        }
    }
    else
    if(simpleTypes[model] != undefined)
    {
        obj[model] = simpleTypes[model];
    }

    return obj;
};

function modelify(data, leNickname, lePath, responseClass){
    var models = data.models;

    if(responseClass == undefined)
    {
        for(var apiIndex in data.apis)
        {
            if(data.apis[apiIndex].path == lePath)
            {
                for(var operationIndex in data.apis[apiIndex].operations)
                {
                    if(data.apis[apiIndex].operations[operationIndex].nickname == leNickname)
                    {
                        responseClass = data.apis[apiIndex].operations[operationIndex].responseClass;
                    }
                }
            }
        }
    }

    if(responseClass == undefined)
    {
        return "This API has no responseClass";
    }


    var obj = {};
    var simpleTypes = {
        string: '',
        int: 0,
        byte: 0,
        long: 0,
        float: 0,
        double: 0,
        boolean: false,
        Date: new Date("1970-01-01T00:00:00.000+0000")
    };

    if(models[responseClass] == undefined)
    {
        return 'Error: Couldn\'t map: \'' + responseClass + '\'. ResponseClassModel is undefined for current API.';
    }

    var props = models[responseClass].properties;
    for (var propertyIndex in props) {
        var property = props[propertyIndex];
        for(var p in property)
        {
                                                                                                                                                                 7
            var isComplex = ((simpleTypes[property[p]] == undefined) || (simpleTypes[property[p]] == null)) ;
            if(isComplex)
            {

                if(models[property[p]] != undefined )
                {

                    var complexObj = {};
                    var complexityType =  models[property[p]].type;
                    var complexPropMod = models[property[p]].properties;


                    if(simpleTypes[complexityType] == undefined)
                    {
                        complexObj[property[p]] = objectify(models, property[p], {}, {}, 0);
                    }
                    else
                    {
                        for(var complexPropIndex in complexPropMod)
                        {
                            var complexProp = complexPropMod[complexPropIndex];
                            for(var cP in complexProp)
                            {
                                complexObj[complexPropIndex] = simpleTypes[complexProp[cP]];
                            }
                        }
                    }

                    obj[propertyIndex] = complexObj;
                }
                else
                {
                    var tmpObj = {};

                    if(property[p] == 'List')
                    {
                        tmpObj = objectify(models, property['items'].$ref, {}, {}, 0);
                        obj[propertyIndex] = [tmpObj];
                    }
                }
            }
            else
            {
                obj[propertyIndex] = simpleTypes[property[p]];
            }
        }
    }


    return obj;
};

function bodify(data, leNickname, lePath)
{
    var obj = {};
    var objType;
    for(var apiIndex in data.apis)
    {
        if(data.apis[apiIndex].path == lePath)
        {
            for(var operationIndex in data.apis[apiIndex].operations)
            {
                if(data.apis[apiIndex].operations[operationIndex].nickname == leNickname)
                {
                    for(var parameterIndex in data.apis[apiIndex].operations[operationIndex].parameters)
                    {
                        if(data.apis[apiIndex].operations[operationIndex].parameters[parameterIndex].paramType == "body")
                        {
                            objType = data.apis[apiIndex].operations[operationIndex].parameters[parameterIndex].dataType;
                        }
                    }
                }
            }
        }
    }

    modelify(data, leNickname, lePath, objType);
};

function toggleResponseClass(caller){
    $(caller).next('p').find('.model-signature').toggle();
    var tmp = $(caller).siblings('div').toggle();
    var tpp = 2;
}

function initMods()
{
    $('.switchIcon').click(function(){
        $('.api_input_field').toggle();
        $('.session_input_field').toggle();
    });
}


