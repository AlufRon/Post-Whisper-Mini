import { PrismaClient } from "@prisma/client"
import { Request, Response } from 'express';
import { actionClient } from "./actionController";

export const botClient = new PrismaClient().bot

export const getAllBots = async (req: Request, res: Response) => {
    try {
        const { skip, take } = req.pagination
        const allBots = await botClient.findMany({
            skip,
            take
        })
        if (allBots.length === 0) {
            return res.status(404).json({ message: 'bots not found' });
        }
        res.json({ data: allBots })
    }
    catch (error) {
        console.log('an error has occured:', error)
        res.status(500).json({ errorMessage: `Failed with error ${error}` })
    }
}


export const getBotById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const bot = await botClient.findUnique({
            where: { id }
        })

        if (!bot) {
            return res.status(404).json({ message: 'Bot not found' })
        }
        res.json({ data: bot })
    }
    catch (error) {
        console.log('Failed to retrieve bot:', error)
        res.status(500).json({ errorMessage: `Failed with error ${error}` })
    }
}
export const getBotByEmail = async (req: Request, res: Response) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ message: 'email query parameter is required' });
    }

    try {
        const bot = await botClient.findUnique({
            where: { email: String(email) },
        });

        if (!bot) {
            return res.status(404).json({ message: 'bot not found' });
        }

        res.json({ data: bot })
    } catch (error) {
        console.log('Failed to retrieve bot:', error);
        res.status(500).json({ errorMessage: `Failed with error ${error}` });
    }
};

export async function getBotsWithActions(req: Request, res: Response) {
    try {
        const { skip, take } = req.pagination;
        const { sortByMostActions, id } = req.query
        let queryOptions = {
            where: {},
            orderBy: {},
            include: {
                Actions: true,
            },
            skip,
            take,
        };

        if (id) {
            queryOptions.where = { id };
        }
        if (sortByMostActions === 'true') {
            queryOptions['orderBy'] = {
                Actions: {
                    _count: 'desc',
                },
            };
        }
        const botsWithActions = await botClient.findMany(queryOptions);

        const totalCount = await botClient.count({
            where: queryOptions.where,
        });

        if (botsWithActions.length === 0) {
            return res.status(404).json({ message: 'nothing found' });
        }

        res.json({ data: botsWithActions, count: totalCount });
    } catch (error) {
        console.error('Error fetching Bots with actions:', error);
        res.status(500).json({ error: 'an error occurred while fetching bots with actions.' });
    }
}

export const createBot = async (req: Request, res: Response) => {
    try {
        const botData = req.body
        const bot = await botClient.create({
            data: botData
        })

        if (!bot) {
            return res.status(404).json({ message: 'Bot was not created' })
        }
        res.json({ data: bot })
    }
    catch (error) {
        console.log('failed to create bot:', error)
        res.status(500).json({ errorMessage: `Failed with error ${error}` })

    }
}

export const bulkCreateBots = async (req: Request, res: Response) => {
    try {
        const botData = req.body;

        if (!Array.isArray(botData)) {
            return res.status(400).json({ message: 'input data should be an array of bots.' });
        }

        const result = await botClient.createMany({
            data: botData,
            skipDuplicates: true,
        });

        res.json({ message: `Successfully created ${result.count} bots.` });
    } catch (error) {
        console.log('Failed to create bots:', error);
        res.status(500).json({ errorMessage: `Failed with error ${error}` });
    }
};

export const updateBot = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const botData = req.body

        const bot = await botClient.update({
            where: { id },
            data: {
                ...botData,
                updatedAt: new Date(),
            },
        })

        if (!bot) {
            return res.status(404).json({ message: 'Bot was not found' })
        }
        res.json({ data: bot })
    }
    catch (error) {
        console.log('failed to update bot:', error)
        res.status(500).json({ errorMessage: `Failed with error ${error}` })

    }
}


export const deleteBot = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        await actionClient.deleteMany({
            where: { botId: id },
        });

        const bot = await botClient.delete({
            where: { id }
        })

        if (!bot) {
            return res.status(404).json({ message: 'Bot was not found' })
        }
        res.json({ message: 'Bot deleted successfully', bot })
    }
    catch (error) {
        console.log('failed to delete bot:', error)
        res.status(500).json({ errorMessage: `Failed with error ${error}` })
    }
}

export const getBotStateSummary = async (req: Request, res: Response) => {
    try {
        const stateSummary = await botClient.groupBy({
            by: ['status'],
            _count: {
                status: true,
            },
        });
        if (stateSummary.length === 0) {
            return res.status(404).json({ message: 'no bots found' });
        }

        res.json({ data: stateSummary });
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ errorMessage: `Failed with error: ${error}` });
    }
};
