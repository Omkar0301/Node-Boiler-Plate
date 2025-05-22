const Joi = require('joi');

const pagination = Joi.object({
  pageNo: Joi.number().integer().min(1).default(1).description('Page number starting from 1'),
  pageSize: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .description('Items per page, max 100')
});

const sorting = Joi.object({
  sort: Joi.array()
    .items(
      Joi.string()
        .pattern(/^(-)?[a-zA-Z0-9]+$/)
        .description('Sort field, prefix "-" for descending')
    )
    .optional()
    .default([])
    .description('Sort as array of strings')
});

const filtering = Joi.object({
  filters: Joi.array()
    .items(
      Joi.object({
        key: Joi.string().required().description('Field to filter'),
        operation: Joi.string()
          .valid('eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'nin', 'regex')
          .required()
          .description('Filter operation'),
        value: Joi.any().required().description('Value for filtering')
      })
    )
    .optional()
    .default([])
    .description('Filters as array of objects')
});

const queryParams = pagination.concat(sorting).concat(filtering);

module.exports = {
  pagination,
  sorting,
  filtering,
  queryParams
};
