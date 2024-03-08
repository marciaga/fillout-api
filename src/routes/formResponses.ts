import express from 'express';

import { formResponseQuerySchema } from '../validators/formResponseSchema';
import {
  getFormSubmissions,
  handleFilterCondition,
  FilterClauseType,
} from '../services/fillout';

const router = express.Router();

router.get('/:formId/filteredResponses', async function (req, res, next) {
  try {
    const { formId } = req.params;

    if (!formId) {
      res.status(401);
      return res.send('Missing form ID.');
    }

    const queryParams = req.query;
    const { filter } = queryParams;

    // since the filter object is serialized, we parse it to ensure it's valid
    if (typeof filter === 'string') {
      try {
        queryParams.filter = JSON.parse(filter);
      } catch (error) {
        // no-op: not a serialized object, send to validator, failure expected
        queryParams.filter = {};
      }
    }

    const validatedQueryParams = formResponseQuerySchema.validateSync(
      queryParams,
      {
        abortEarly: false,
        stripUnknown: true,
      },
    );

    // pass validated query params to service that GETs form submissions

    const responses = await getFormSubmissions({ formId });

    // if there's a filter array, we have work to do
    if (queryParams?.filter && Array.isArray(queryParams?.filter)) {
      const filterParams = queryParams?.filter as FilterClauseType[];
      const filteredResponses = handleFilterCondition({
        filterParams,
        responseJson: responses,
      });
      responses.responses = filteredResponses;
    }

    res.json({ success: 'OK', responses });
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error while fetching responses.`, err.message);
    }
    next(err);
  }
});

export default router;
