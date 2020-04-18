const organizationInterface = require("../interfaces/organizationInterface");
const cacheManager = require("../cache").getInstance();

const findAllOrganizationNames = async () => {
  return await cacheManager.get(
    "allOrganizationName",
    organizationInterface.findAllOrganizationNames,
    24 * 3600
  );
};
