import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { IMeal } from './meal.interface';
import { IImageFiles } from '../../interface/IImageFile';
import { Meal } from './meal.model';
import { IJwtPayload } from '../Auth/auth.interface';
import User from '../User/user.model';
import { UserRole } from '../User/user.interface';

const createMeal = async (
  productData: Partial<IMeal>,
  productImages: IImageFiles,
  user: IJwtPayload
) => {
  console.log('user', user);
  const provider = await User.findOne({
    _id: user,
    role: UserRole.MEAL_PROVIDER,
  });
  if (!provider) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Invalid meal provider');
  }
  const { images } = productImages;
  if (!images || images.length === 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Meal images are required.');
  }

  productData.image = images.map((image) => image.path);

  // const isCategoryExists = await Category.findById(productData.category);
  // if (!isCategoryExists) {
  //   throw new AppError(StatusCodes.BAD_REQUEST, 'Category does not exist!');
  // }

  // if (!isCategoryExists.isActive) {
  //   throw new AppError(StatusCodes.BAD_REQUEST, 'Category is not active!');
  // }

  const newProduct = new Meal({
    ...productData,
    shop: shop._id,
  });

  const result = await newProduct.save();
  return result;
};
export const MealService = {
  createMeal,
  //   getAllProduct,
  //   getTrendingProducts,
  //   getSingleProduct,
  //   updateProduct,
  //   deleteProduct,
  //   getMyShopProducts
};
