import { body, param, validationResult } from "express-validator";

export const validate = (rules) => [
  ...rules,
  (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array() });
    }
    next();
  },
];

export const productCreateRules = [
  body("name").isString().trim().notEmpty(),
  body("price").isNumeric(),
  body("stock").isNumeric(),
  body("features").isString().trim().notEmpty(),
  body("description").isString().trim().notEmpty(),
  body("mainCategory").isString().trim().notEmpty(),
  body("subcategory").isString().trim().notEmpty(),
  body("brand").isString().trim().notEmpty(),
  body("photoUrls").isArray({ min: 1 }),
];

export const productUpdateRules = [
  param("id").isString().trim().notEmpty(),
  body("name").optional().isString().trim().notEmpty(),
  body("price").optional().isNumeric(),
  body("stock").optional().isNumeric(),
  body("features").optional().isString().trim().notEmpty(),
  body("description").optional().isString().trim().notEmpty(),
  body("mainCategory").optional().isString().trim().notEmpty(),
  body("subcategory").optional().isString().trim().notEmpty(),
  body("brand").optional().isString().trim().notEmpty(),
  body("photoUrls").optional().isArray({ min: 1 }),
];

export const categoryCreateRules = [
  body("name").isString().trim().notEmpty(),
];

export const subcategoryAddRules = [
  param("categoryName").isString().trim().notEmpty(),
  body("name").isString().trim().notEmpty(),
];

export const brandAddRules = [
  param("categoryName").isString().trim().notEmpty(),
  param("subName").isString().trim().notEmpty(),
  body("brand").isString().trim().notEmpty(),
];

export const bannerCreateRules = [
  body("title").isString().trim().notEmpty(),
  body("imageUrl").isString().trim().notEmpty(),
  body("type").optional().isString().trim().isIn(["hero","seasonal"]).withMessage("type must be 'hero' or 'seasonal'"),
];
