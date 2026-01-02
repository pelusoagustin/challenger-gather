import type { Request, Response } from "express";
import type { IMathService } from "../../../../application/ports/IMathService";

export class MathController {
  constructor(private readonly mathService: IMathService) {}

  getLcm = (req: Request, res: Response): void => {
    const raw = String(req.query.numbers);
    const numbers = raw.split(",").map((item) => Number(item.trim()));

    const lcm = this.mathService.getLeastCommonMultiple(numbers);
    res.json({ lcm });
  };

  getIncrement = (req: Request, res: Response): void => {
    const value = Number(req.query.number as string);
    const result = this.mathService.increment(value);
    res.json({ result });
  };
}
