import { PrismaClient } from "@prisma/client"
import { Request, Response } from 'express';
import { getDateFilterQuery } from "../utils/dateFilters";

const postClient = new PrismaClient().post;

export const getAllPosts = async (req: Request, res: Response) => {
    const { postType, actions } = req.query;
    const { skip, take } = req.pagination;

    let filterOptions: any = {};
    if (postType) {
        filterOptions.type = postType;
    }

    const dateFilter = getDateFilterQuery(req);
    filterOptions = { ...filterOptions, ...dateFilter };

    let findManyOptions: any = {
        where: filterOptions,
        skip,
        take,
    };

    if (actions === 'true') {
        findManyOptions.include = {
            Actions: true,
        };
    }
    try {
        const allPosts = await postClient.findMany(findManyOptions);

        if (allPosts.length === 0) {
            return res.status(404).json({ message: 'Nothing found' });
        }
        const totalCount = await postClient.count({
            where: filterOptions,
        });
        res.json({ data: allPosts, count: totalCount });
    } catch (error) {
        console.log('An error has occurred:', error);
        res.status(500).json({ errorMessage: `Failed with error ${error}` });
    }
};

export const getPostById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const post = await postClient.findUnique({
            where: { id }
        })

        res.json({ data: [post] })
    }
    catch (error) {
        console.log('Failed to retrieve post:', error)
        res.status(500).json({ errorMessage: `Failed with error ${error}` })
    }
}

export const createPost = async (req: Request, res: Response) => {
    try {
        const postData = req.body
        const post = await postClient.create({
            data: postData
        })

        if (!post) {
            return res.status(404).json({ message: 'Post was not created' })
        }
        res.json({ data: post })
    }
    catch (error) {
        console.log('Failed to create post:', error)
        res.status(500).json({ errorMessage: `Failed with error ${error}` })

    }
}

export const bulkCreatePosts = async (req: Request, res: Response) => {
    try {
        const postData = req.body;

        if (!Array.isArray(postData)) {
            return res.status(400).json({ message: 'Input data should be an array of posts.' });
        }

        const result = await postClient.createMany({
            data: postData,
            skipDuplicates: true,
        });

        res.json({ message: `Successfully created ${result.count} posts.` });
    } catch (error) {
        console.log('Failed to create posts:', error);
        res.status(500).json({ errorMessage: `Failed with error ${error}` });
    }
};

export const updatePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const postData = req.body

        const post = await postClient.update({
            where: { id },
            data: postData
        })

        if (!post) {
            return res.status(404).json({ message: 'post was not found' })
        }
        res.json({ data: post })
    }
    catch (error) {
        console.log('Failed to update post:', error)
        res.status(500).json({ errorMessage: `Failed with error ${error}` })

    }
}


export const deletePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const post = await postClient.delete({
            where: { id }
        })

        if (!post) {
            return res.status(404).json({ message: 'post was not found' })
        }
        res.json({ message: 'post deleted successfully', post: post })
    }
    catch (error) {
        console.log('Failed to delete post:', error)
        res.status(500).json({ errorMessage: `Failed with error ${error}` })
    }
}

export async function getPostsWithActionsById(req: Request, res: Response) {
    try {
        const { id } = req.params
        const { skip, take } = req.pagination
        const postsWithActions = await postClient.findMany({
            where: { id },
            include: {
                Actions: true,
            },
            skip,
            take
        });

        if (postsWithActions.length === 0) {
            return res.status(404).json({ message: 'Nothing found' });
        }
        res.json({ data: postsWithActions });
    } catch (error) {
        console.error('Error fetching posts with actions:', error);
        res.status(500).json({ error: 'An error occurred while fetching posts with actions.' });
    }
}
export const getPostStateSummary = async (req: Request, res: Response) => {
    try {
        const stateSummary = await postClient.groupBy({
            by: ['type'],
            _count: {
                type: true,
            },
        });
        if (stateSummary.length === 0) {
            return res.status(404).json({ message: 'No posts found' });
        }

        res.json({ data: stateSummary });
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ errorMessage: `Failed with error: ${error}` });
    }
};
