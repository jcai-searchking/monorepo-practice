import { Request, Response, NextFunction } from 'express';
import * as UserServices from './users.services';
import { CreateUserInput, UserParamInput } from './users.schemas'

export const createUser = async ( req:Request, res: Response, next: NextFunction ) => {
    try {
        const userData = req.validatedBody as CreateUserInput;
        const user = await UserServices.createUser(userData);

        res.status(201).json({ message: 'User succesfully created', user});
    } catch (error) {
        next(error)
    }
}

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.validatedParams as UserParamInput
        const user = await UserServices.getUserByIdService(id)
        res.status(200).json({user})
    } catch (error) {
        next(error)
    }
}