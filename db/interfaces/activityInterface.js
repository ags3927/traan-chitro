const mongoose = require("mongoose");
const _ = require("lodash");
const moment = require("moment");

const { Activity } = require("../models/activity");
const ObjectId = mongoose.Types.ObjectId;

const reliefTypes = ["FOOD", "PPE", "MASK", "SANITIZER", "GLOVE"];


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

const resolveScheduleAndFilterByBoundsWithoutOrganization = async (bounds, filter) => {

  if (filter.schedule === "PAST") {
    let locations = await Activity.find(
        {
          typeOfRelief: {
            $in: filter.typeOfRelief
          },
          deliveryDate: {
            $lt: moment().valueOf()
          },
          location: {
            $geoWithin: {
              $box: [ [bounds.southwest.lng, bounds.southwest.lat], [bounds.northeast.lng, bounds.northeast.lat] ],
            }
          }
        },
        {
          _id: 0,
          "location.coordinates": 1
        });

    return _.map(locations, (element) => {
      return {
        lat: element.location.coordinates[1],
        lng: element.location.coordinates[0],
      };
    });
  } else {
    let locations = await Activity.find(
        {
          typeOfRelief: {
            $in: filter.typeOfRelief
          },
          deliveryDate: {
            $gt: moment().valueOf()
          },
          location: {
            $geoWithin: {
              $box: [ [bounds.southwest.lng, bounds.southwest.lat], [bounds.northeast.lng, bounds.northeast.lat] ],
            }
          }
        },
        {
          _id: 0,
          "location.coordinates": 1
        });

    return _.map(locations, (element) => {
      return {
        lat: element.location.coordinates[1],
        lng: element.location.coordinates[0],
      };
    });
  }

};


const resolveScheduleAndFilterByBoundsWithOrganization = async (bounds, filter) => {

  if (filter.schedule === "PAST") {
    let locations = await Activity.find(
        {
          orgName: filter.orgName,
          typeOfRelief: {
            $in: filter.typeOfRelief
          },
          deliveryDate: {
            $lt: moment().valueOf()
          },
          location: {
            $geoWithin: {
              $box: [ [bounds.southwest.lng, bounds.southwest.lat], [bounds.northeast.lng, bounds.northeast.lat] ],
            }
          }
        },
        {
          _id: 0,
          "location.coordinates": 1
        });

    return _.map(locations, (element) => {
      return {
        lat: element.location.coordinates[1],
        lng: element.location.coordinates[0],
      };
    });
  } else {
    let locations = await Activity.find(
        {
          orgName: filter.orgName,
          typeOfRelief: {
            $in: filter.typeOfRelief
          },
          deliveryDate: {
            $gt: moment().valueOf()
          },
          location: {
            $geoWithin: {
              $box: [ [bounds.southwest.lng, bounds.southwest.lat], [bounds.northeast.lng, bounds.northeast.lat] ],
            }
          }
        },
        {
          _id: 0,
          "location.coordinates": 1
        });

    return _.map(locations, (element) => {
      return {
        lat: element.location.coordinates[1],
        lng: element.location.coordinates[0],
      };
    });
  }

};


const findActivitiesByBounds = async (bounds, filter) => {
  try {
    if (filter.typeOfRelief.length === 0) {
      filter.typeOfRelief = reliefTypes;
    }

    if (orgName === null) {
      return await resolveScheduleAndFilterByBoundsWithoutOrganization(bounds, filter);
    } else {
      return await resolveScheduleAndFilterByBoundsWithOrganization(bounds, filter);
    }

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
