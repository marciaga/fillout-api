import * as yup from 'yup';

enum StatusEnum {
  InProgress = 'in_progress',
}

enum SortEnum {
  Asc = 'asc',
  Desc = 'desc',
}

enum ConditionEnum {
  Equals = 'equals',
  DoesNotEqual = 'does_not_equal',
  GreaterThan = 'greater_than',
  LessThan = 'less_than',
}

type FilterClauseType = {
  id: string;
  condition: `${ConditionEnum}`;
  value: number | string;
};

const RESPONSE_MAX_LIMIT = 150;

export const formResponseQuerySchema = yup.object({
  limit: yup.number().max(RESPONSE_MAX_LIMIT).optional(),
  afterDate: yup.date().optional(), // YYYY-MM-DDTHH:mm:ss.sssZ
  beforeDate: yup.date().optional(), // YYYY-MM-DDTHH:mm:ss.sssZ
  offset: yup.number().optional(),
  status: yup.string().oneOf([StatusEnum.InProgress]).optional(),
  includeEditLink: yup.boolean().optional(),
  sort: yup.string().oneOf([SortEnum.Asc, SortEnum.Desc]).optional(),
  filter: yup
    .array(
      yup.object({
        id: yup.string(),
        condition: yup.string().oneOf(Object.values(ConditionEnum)),
        value: yup
          .mixed()
          .test(
            'is-string-or-number',
            'Value must be either a string or a number',
            value => typeof value === 'string' || typeof value === 'number',
          ),
      }),
    )
    .default(undefined),
});
