const scan = async (client, cursor, labels, term) => {
  const response = await client.scan(cursor, 'MATCH', term, 'COUNT', 10);
  cursor = response[0];
  labels = labels.concat(response[1]);
  if (cursor === '0') {
    return labels;
  }
  return scan(client, cursor, labels, term);
};

// create fuctions
const createArray = async (client, type, array) => {
  try {
    result = await client.set(type, array);
    return result;
  } catch (error) {
    console.error(error);
  }
};

// retrieve functions
const getProperty = async (client, key) => {
  try {
    properties = await client.get(key);
    return properties;
  } catch (error) {
    console.error(error);
  }
};

const getProperties = async (client, key) => {
  try {
    const pObject = await client.hgetall(key);
    return pObject;
  } catch (error) {
    console.error(error);
  }
};

// delete functions
const deleteOneKey = async (client, key) => {
  try {
    result = await client.del(client, key);
    return result;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  createArray,
  getProperty,
  deleteOneKey,
  getProperties,
  scan,
};
