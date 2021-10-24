import { Request, Response } from 'express';
import InputError from '../errors/InputError';
import WilderModel from '../models/Wilder';
import {validationResult} from "express-validator";

export default {
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