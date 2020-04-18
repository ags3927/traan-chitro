// needs rigorous testing.

const organizationInterface = require("../interfaces/organizationInterface");
const cacheManager = require("../cache").getInstance();

const findAllOrganizationNames = async () => {
  return await cacheManager.get(
    "allOrganizationName",
    organizationInterface.findAllOrganizationNames,
    24 * 3600 // caching for a day
  );
};

const cacheCallbackWraper = (func, param) => {
  return async () => func(...param);
};

const findAllActivitesOfOrganization = async (orgName) => {
  return await cacheManager.get(
    "orgName",
    cacheCallbackWraper(organizationInterface.findAllActivitesOfOrganization, [
      orgName,
    ])
  );
};
