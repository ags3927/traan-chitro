// needs rigorous testing.

const organizationInterface = require("../interfaces/organizationInterface");
const cache = require("../cache");

const findAllOrganizationNames = async () => {
  const cacheResult = cache.get("allOrganizationName");
  if (cacheResult.found) {
    return cacheResult.data;
  } else {
    const value = await organizationInterface.findAllOrganizationNames();
    cache.set("allOrganizationName", value);
    return value;
  }
};

const findAllActivitiesOfOrganization = async (orgName) => {
  const cacheResult = cache.get(orgName);
  if (cacheResult.found) {
    return cacheResult.data;
  } else {
    const value = await organizationInterface.findAllActivitesOfOrganization(
      orgName
    );
    cache.setWithExpiration(orgName, value, 30 * 60); // 30 minute expiration period
    return value;
  }
};

module.exports = {
  findAllOrganizationNames,
  findAllActivitiesOfOrganization,
};
