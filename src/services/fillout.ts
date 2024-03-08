import axios from 'axios';

// constants
const baseUrl = 'https://api.fillout.com';
const apiVersion = 'v1/api';
const formsEndpoint = `${baseUrl}/${apiVersion}/forms`;

// types/interfaces, move to separate type def file
interface IGetFormSubmissions {
  formId: string;
}

enum ConditionEnum {
  Equals = 'equals',
  DoesNotEqual = 'does_not_equal',
  GreaterThan = 'greater_than',
  LessThan = 'less_than',
}
export type FilterClauseType = {
  id: string;
  condition: `${ConditionEnum}`;
  value: number | string;
};

interface ResponseQuestion {
  id: string;
  name: string;
  type: string;
  value: string;
}

interface Response {
  questions: ResponseQuestion[];
}

export interface IResponseJson {
  responses: Response[];
}

interface IHandleFilterConditionParams {
  filterParams: FilterClauseType[];
  responseJson: IResponseJson;
}

// luckily date strings get parsed comparably so no date math is needed
const matchingFn = (
  filterVal: number | string,
  responseVal: number | string,
  condition: `${ConditionEnum}`,
) => {
  switch (condition) {
    case ConditionEnum.Equals:
      return filterVal === responseVal;
    case ConditionEnum.DoesNotEqual:
      return filterVal !== responseVal;
    case ConditionEnum.GreaterThan:
      return filterVal < responseVal;
    case ConditionEnum.LessThan:
      return filterVal > responseVal;
    // implication is that if we were unable to match given the condition, it counts as a not-match
    default:
      return false;
  }
};

export const handleFilterCondition = ({
  filterParams,
  responseJson,
}: IHandleFilterConditionParams) => {
  const result = responseJson.responses.filter(responseObj => {
    const { questions } = responseObj;
    let matchFound = false;

    questions.forEach(question => {
      filterParams.forEach(filterObj => {
        const { id, condition, value } = filterObj;
        // if no matching ID or the value is null, continue iteration
        // assumption is that null values are to be ignored for filtering purposes
        if (question.id !== id || question.value === null) {
          return;
        }
        matchFound = matchingFn(value, question.value, condition);
      });
    });

    return matchFound;
  });

  return result;
};

export const getFormSubmissions = async ({ formId }: IGetFormSubmissions) => {
  const endpoint = `${formsEndpoint}/${formId}/submissions`;
  try {
    const { data } = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${process.env.FILLOUT_API_KEY}`,
      },
    });

    return data;
  } catch (error) {
    console.log('error: ', error);
    throw new Error('Something went wrong while fetching form submissions.');
  }
};
