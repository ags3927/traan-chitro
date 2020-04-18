const mongoose = require("mongoose");
const _ = require("lodash");

const { Activity } = require("../models/activity");
const ObjectId = mongoose.Types.ObjectId;

const insertActivity = async (activityObject) => {
  let activity = new Activity({
    orgName: activityObject.orgName,
    location: activityObject.location,
  });

  try {
    return await Activity.collection.insertOne(activity);
  } catch (e) {
    return null;
  }
};

const insertActivities = async (activityObjectArray) => {
  try {
    return await Activity.collection.insertMany(activityObjectArray, {
      ordered: false,
    });
  } catch (e) {
    return null;
  }
};

const deleteActivity = async (id) => {
  try {
    return await Activity.collection.deleteOne({ _id: ObjectId(id) });
  } catch (e) {
    return null;
  }
};

const deleteActivities = async (orgName) => {
  try {
    return await Activity.collection.deleteMany({ orgName: orgName });
  } catch (e) {
    return null;
  }
};

const editActivity = async (id, activityObject) => {
  try {
    return await Activity.collection.replaceOne(
      { _id: ObjectId(id) },
      activityObject
    ); ////
  } catch (e) {
    return null;
  }
};

const editActivities = async (prevOrgName, updatedOrgName) => {
  try {
    return await Activity.updateMany(
      { orgName: prevOrgName },
      { $set: { orgName: updatedOrgName } }
    );
  } catch (e) {
    return null;
  }
};

const findActivitiesByBounds = async (southwest, northeast) => {
  try {
    let locations = await Activity.find(
      {
        location: {
          $geoWithin: {
            $box: [southwest, northeast],
          },
        },
      },
      { _id: 0, "location.coordinates": 1 }
    );

    return _.map(locations, (element) => {
      return {
        lat: element.location.coordinates[1],
        lng: element.location.coordinates[0],
      };
    });
  } catch (e) {
    return null;
  }
};

const findActivitiesByCoords = async (lat, lng) => {
  try {
    return await Activity.find({ "location.coordinates": [lng, lat] });
  } catch (e) {
    return null;
  }
};

module.exports = {
  insertActivity,
  insertActivities,
  deleteActivity,
  deleteActivities,
  editActivity,
  editActivities,
  findActivitiesByBounds,
  findActivitiesByCoords,
};
