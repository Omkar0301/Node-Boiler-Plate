const parseQuery = ({ filters = [], sort = [], pageNo = 1, pageSize = 10 }) => {
  const query = {};
  const sortObj = {};
  const populatePaths = new Set();

  filters.forEach(({ key, operation, value }) => {
    if (key.includes('.')) {
      const pathParts = key.split('.');
      const populatePath = pathParts[0];
      populatePaths.add(populatePath);
    }

    switch (operation) {
      case 'eq':
        query[key] = value;
        break;
      case 'ne':
        query[key] = { $ne: value };
        break;
      case 'gt':
        query[key] = { $gt: value };
        break;
      case 'gte':
        query[key] = { $gte: value };
        break;
      case 'lt':
        query[key] = { $lt: value };
        break;
      case 'lte':
        query[key] = { $lte: value };
        break;
      case 'in':
        query[key] = { $in: Array.isArray(value) ? value : [value] };
        break;
      case 'nin':
        query[key] = { $nin: Array.isArray(value) ? value : [value] };
        break;
      case 'regex':
        query[key] = { $regex: new RegExp(value, 'i') };
        break;
    }
  });

  sort.forEach((field) => {
    const direction = field.startsWith('-') ? -1 : 1;
    const key = field.replace(/^[-+]/, '');

    if (key.includes('.')) {
      const pathParts = key.split('.');
      const populatePath = pathParts[0];
      populatePaths.add(populatePath);
    }

    sortObj[key] = direction;
  });

  const limit = parseInt(pageSize);
  const skip = (parseInt(pageNo) - 1) * limit;

  return {
    query,
    sortBy: sortObj,
    skip,
    limit,
    populatePaths: Array.from(populatePaths)
  };
};

module.exports = parseQuery;
