let mongoose = require('mongoose');
let _ = require('lodash');

let {Organization} = require('../models/organization');
let activityInterface = require('./activityInterface');

let insertOrganization = async (orgObject) => {
    let organization = new Organization({
        name: orgObject.name
    })

    try {
        return await Organization.collection.insertOne(organization);
    } catch (e) {
        return null;
    }
}

// let insertOrganizations = async (orgObjectArray) => {
//     try {
//         return await Organization.collection.insertMany(orgObjectArray, { ordered: false});
//     } catch (e) {
//         console.log(e);
//     }
// }

let deleteOrganization = async (name) => {
    try{
        activityInterface.deleteActivities(name).then(doc => console.log(doc));
        return await Organization.collection.deleteOne({ 'name': name });
    } catch (e) {
        return null;
    }
}

let editOrganization = async (name,orgObject) => {
    try {
        await activityInterface.editActivities(name, orgObject.name);
        return await Organization.collection.replaceOne({ 'name': name},orgObject);
    } catch (e) {
        return null;
    }
}

let findOrganizationByName = async (orgName) => {
    try {
        return await Organization.find({name: orgName});
    } catch (e) {
        return null;
    }
}

let findAllOrganizations = async () => {
    try {
        return await Organization.find();
    } catch (e) {
        return null;
    }
}

let findAllOrganizationNames = async () => {
    try {
        let orgNames = await Organization.find({}, { _id:0,name:1 });
        return _.map(orgNames,(orgName) => {
            return orgName.name;
        });
    } catch (e) {
        return null;
    }
}

module.exports = {insertOrganization, deleteOrganization, editOrganization, findAllOrganizations, findOrganizationByName, findAllOrganizationNames};