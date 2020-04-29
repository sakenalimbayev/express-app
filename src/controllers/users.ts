import * as express from 'express';
import {createValidator} from "express-joi-validation";
import * as Joi from "@hapi/joi";

import {User} from "../models/user";
import {mockUsers} from "../mockData";

const router = express.Router();

const validator = createValidator();
const usersPostSchema = Joi.object({
    id: Joi.string().required(),
    login: Joi.string().required(),
    password: Joi.string().required(),
    age: Joi.number().min(4).max(30).required(),
    isDeleted: Joi.boolean().required()
});

router.route('/users')
    .get((req, res, next) => {
        res.json(mockUsers);
    })
    .post(validator.body(usersPostSchema),(req, res, next) => {
        const resultUser = mockUsers.filter((user: User) => req.body.id === user.id);
        if (resultUser.length === 0) {
            mockUsers.push(req.body);
            res.end();
        } else {
            mockUsers.map((user: User, index: number) => {
                if (user.id === req.body.id) {
                    mockUsers[index] = req.body;
                }
            });
            res.end();
        }
    });

router.param('userId', (req, res, next, userId) => {
    const resultUser = mockUsers.findIndex((user: User) => user.id === userId);
    resultUser === -1 ? res.sendStatus(404) : next();
});

router.route('/users/:userId')
    .get((req, res, next) => {
        const resultUser = mockUsers.filter((user: User) => req.params.userId === user.id);
        if (resultUser.length === 0) {
            res.sendStatus(404);
        } else {
            res.json(resultUser[0]);
        }
    })
    .delete((req, res, next) => {
        const userId = req.params.userId;
        mockUsers.map((user: User, index: number) => {
            if (userId === user.id) {
                mockUsers[index].isDeleted = true;
            }
        });
        res.end();
    });

export default router;