let mongoose = require('mongoose');
let _ = require('lodash');

let {Activity} = require('../models/activity');
let ObjectId = mongoose.Types.ObjectId;

let insertActivity = async (activityObject) => {
    let activity = new Activity({
        orgName: activityObject.orgName,
        location: activityObject.location
    })

     try {
        return await Activity.collection.insertOne(activity);
     } catch (e) {
         return null;
     }
}

let insertActivities = async (activityObjectArray) => {
    try {
        return await Activity.collection.insertMany(activityObjectArray, { ordered: false});
    } catch (e) {
        return null;
    }
}

let deleteActivity = async (id) => {
    try{
        return await Activity.collection.deleteOne({ '_id': ObjectId(id) });
    } catch (e) {
        return null;
    }
}

let deleteActivities = async (orgName) => {
    try {
        return await Activity.collection.deleteMany({ 'orgName': orgName });
    } catch (e) {
        return null;
    }
}

let editActivity = async (id,activityObject) => {
    try {
        return await Activity.collection.replaceOne({ '_id': ObjectId(id)},activityObject); ////
    } catch (e) {
        return null;
    }
}

let editActivities = async (prevOrgName,updatedOrgName) => {
    try {
        return await Activity.updateMany({ 'orgName': prevOrgName }, { $set: { orgName: updatedOrgName }});
    } catch (e) {
        return null;
    }
}
let findActivitiesByBounds = async (southwest,northeast) => {
    try {
        let locations = await Activity.find({
            location: {
                $geoWithin: {
                    $box: [southwest,northeast]
                }
            }
        }, { _id:0, 'location.coordinates':1 })

        return _.map(locations, (element) => {
            return {
                lat: element.location.coordinates[1],
                lng: element.location.coordinates[0]
            }
        });

    } catch (e) {
        return null;
    }
}

let findActivitiesByCoords = async (lat,lng) => {
    try {
        return  await Activity.find({ 'location.coordinates': [lng,lat] } );
    } catch (e) {
        return null;
    }
}

module.exports = {insertActivity, insertActivities, deleteActivity, deleteActivities, editActivity, editActivities, findActivitiesByBounds, findActivitiesByCoords}