import { ActionType, PrismaClient, Status } from "@prisma/client"
import { Request, Response } from 'express';
import { getDateFilterQuery } from "../utils/dateFilters";
import { botClient } from "./botsController";

export const actionClient = new PrismaClient().action

export const getAllActions = async (req: Request, res: Response) => {
    try {
        const dateFilter = getDateFilterQuery(req);
        const { skip, take } = req.pagination
        const allActions = await actionClient.findMany({
            where: {
                ...dateFilter
            },
            skip,
            take
        })

        if (allActions.length === 0) {
            return res.status(404).json({ message: 'Actions not found' });
        }
        const totalCount = await actionClient.count();
        res.json({ data: allActions, count: totalCount });
    }
    catch (error) {
        console.log('An error has occured:', error)
        res.status(500).json({ errorMessage: `Failed with error ${error}` })
    }
}

const allowedFields = ['id', 'botId', 'postId'];

export const getActionsByField = async (req: Request, res: Response) => {
    const { field, value } = req.params;
    const dateFilter = getDateFilterQuery(req);

    if (!allowedFields.includes(field)) {
        return res.status(400).json({ message: `Querying by ${field} is not allowed.` });
    }

    try {
        const { skip, take } = req.pagination
        const actions = await actionClient.findMany({
            where: {
                [field]: value,
                ...dateFilter
            },
            skip,
            take
        });

        if (actions.length === 0) {
            return res.status(404).json({ message: 'Actions not found' });
        }

        res.json({ data: actions });
    } catch (error) {
        console.log(`Failed to retrieve actions by ${field}:`, error);
        res.status(500).json({ errorMessage: `Failed with error ${error}` });
    }
};


export const createAction = async (req: Request, res: Response) => {
    try {
        const actionData = req.body

        const action = await actionClient.create({
            data: actionData
        })

        if (!action) {
            return res.status(404).json({ message: 'Action was not created' })
        }
        res.json({ data: action })
    }
    catch (error) {
        console.log('Failed to create action:', error)
        res.status(500).json({ errorMessage: `Failed with error ${error}` })

    }
}

interface CreateActionRequestBody {
    postId: string;
    actionTypes: ActionType[];
    excludedBots?: string[];
}

export const createActionsPerBot = async (req: Request, res: Response) => {
    const { postId, actionTypes, excludedBots = [] }: CreateActionRequestBody = req.body;

    try {
        const bots = await botClient.findMany({
            where: {
                NOT: {
                    id: {
                        in: excludedBots,
                    },
                },
                status: Status.ACTIVE
            },
            select: {
                id: true,
            },
        });
        console.log(actionTypes)
        if (!Array.isArray(actionTypes)) {
            return res.status(400).json({ errorMessage: "Invalid or missing actionTypes." });
        }
        const actionsData = bots.flatMap(bot =>
            actionTypes.map(actionType => ({
                botId: bot.id,
                postId: postId,
                actionType: actionType,
            }))
        );

        const result = await actionClient.createMany({
            data: actionsData,
            skipDuplicates: true,
        });

        res.json({ message: `Successfully created ${result.count} actions.` });
    } catch (error) {
        console.error('Failed to create actions:', error);
        res.status(500).json({ errorMessage: `Failed with error: ${error instanceof Error ? error.message : 'unknown error'}` });
    }
};



export const bulkCreateActions = async (req: Request, res: Response) => {
    try {
        const actionsData = req.body;

        if (!Array.isArray(actionsData)) {
            return res.status(400).json({ message: 'Input data should be an array of actions.' });
        }

        const result = await actionClient.createMany({
            data: actionsData,
            skipDuplicates: true,
        });

        res.json({ message: `Successfully created ${result.count} actions.` });
    } catch (error) {
        console.log('Failed to create actions:', error);
        res.status(500).json({ errorMessage: `Failed with error ${error}` });
    }
};
export const updateAction = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const actionData = req.body

        const action = await actionClient.update({
            where: { id },
            data: actionData
        })

        if (!action) {
            return res.status(404).json({ message: 'Action was not found' })
        }
        res.json({ data: action })
    }
    catch (error) {
        console.log('Failed to update action:', error)
        res.status(500).json({ errorMessage: `Failed with error ${error}` })

    }
}


export const deleteAction = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const action = await actionClient.delete({
            where: { id }
        })

        if (!action) {
            return res.status(404).json({ message: 'Action was not found' })
        }
        res.json({ message: 'Action deleted successfully', action })
    }
    catch (error) {
        console.log('Failed to delete action:', error)
        res.status(500).json({ errorMessage: `Failed with error ${error}` })
    }
}

export const getActionStateSummary = async (req: Request, res: Response) => {
    try {
        const stateSummary = await actionClient.groupBy({
            by: ['status'],
            _count: {
                status: true,
            },
        });
        if (stateSummary.length === 0) {
            return res.status(404).json({ message: 'No actions found' });
        }

        res.json({ data: stateSummary });
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ errorMessage: `Failed with error: ${error}` });
    }
};
