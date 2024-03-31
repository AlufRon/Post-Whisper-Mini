import { Prisma } from '@prisma/client'
import { Request } from 'express'


export function getDateFilterQuery(req: Request): Prisma.ActionWhereInput {
  const dateFilter: Prisma.ActionWhereInput = {}
const {start, end} = req.query
  if (start || end) {
    const dateTimeFilter: Prisma.DateTimeFilter = {}

    if (start) {
      dateTimeFilter.gte = new Date(start as string)
    }

    if (end) {
      dateTimeFilter.lte = new Date(end as string)
    } else {
      dateTimeFilter.lte = new Date()
    }

    dateFilter.createdAt = dateTimeFilter
  }

  return dateFilter
}