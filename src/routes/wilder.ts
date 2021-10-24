import { Request, Response, Router } from 'express';
import InputError from '../errors/InputError';
import WilderModel from '../models/Wilder';
import {body, validationResult} from "express-validator";
import asyncHandler from "express-async-handler";

const controller =  {
  create: async (req: Request, res: Response): Promise<void> => {
    const errorResult = validationResult(req); // Sending back errors
    if (!errorResult.isEmpty()) {
      console.log(errorResult);
      throw new InputError(errorResult.array());
    }
    await WilderModel.init();
    const wilder = new WilderModel(req.body);
    const result = await wilder.save();
    res.json({ success: true, result });
  },
  read: async (req: Request, res: Response): Promise<void> => {
    const result = await WilderModel.find();
    res.json({ success: true, result });
  },
  update: async (req: Request, res: Response): Promise<void> => {
    // eslint-disable-next-line no-underscore-dangle
    const result = await WilderModel.updateOne({ _id: req.body._id }, req.body);
    res.json(result);
  },
  delete: async (req: Request, res: Response): Promise<void> => {
    // eslint-disable-next-line no-underscore-dangle
    const result = await WilderModel.deleteOne({ _id: req.body._id });
    res.json({ success: true, result });
  },
};

const router = Router();

router.route('/api/wilders')
    .post(  [
      body('name')
          .isLength({ min: 3 })
          .withMessage('Name must be at least 3 characters'),
      body('city').isString().withMessage('City must be a string'),
      body('skills.*.title')
          .isLength({ min: 2 })
          .withMessage('SKill title must be at least 2 characters.'),
      body('skills.*.votes')
          .isInt({ min: 0 })
          .withMessage('Skill votes must be an integer greater of equal to 0'),
    ], asyncHandler(controller.create))
    .get(asyncHandler(controller.read))
    .put(asyncHandler(controller.update))
    .delete(asyncHandler(controller.delete));

export default router;