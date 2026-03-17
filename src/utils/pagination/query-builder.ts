import { ObjectLiteral, Repository } from 'typeorm';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { Request } from 'express'; // import express Request

export async function queryWithPagination<T extends ObjectLiteral>(
  req: Request,
  repository: Repository<T>,
  dto: PaginationQueryDto,
) {
  const page = dto.page ?? 1;
  const limit = dto.limit ?? 10;
  const sortBy = dto.sortBy ?? 'createdAt';
  const order = dto.order ?? 'DESC';

  const qb = repository.createQueryBuilder('entity');

  // filters
  if (dto.color) qb.andWhere('entity.color = :color', { color: dto.color });
  if (dto.gender)
    qb.andWhere('entity.gender = :gender', { gender: dto.gender });
  if (dto.minPrice !== undefined)
    qb.andWhere('entity.price >= :minPrice', { minPrice: dto.minPrice });
  if (dto.maxPrice !== undefined)
    qb.andWhere('entity.price <= :maxPrice', { maxPrice: dto.maxPrice });

  qb.orderBy(`entity.${sortBy}`, order);
  qb.skip((page - 1) * limit).take(limit);

  const [data, total] = await qb.getManyAndCount();
  const totalPages = Math.ceil(total / limit);

  // build dynamic link preserving all query params except page
  const buildLink = (pageNumber: number | null) => {
    if (!pageNumber) return null;
    const url = new URL(
      `${req.protocol}://${req.get('host')}${req.originalUrl}`,
    );
    url.searchParams.set('page', pageNumber.toString());
    url.searchParams.set('limit', limit.toString());
    return url.toString();
  };

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
    links: {
      first: buildLink(1),
      last: buildLink(totalPages),
      next: page < totalPages ? buildLink(page + 1) : null,
      prev: page > 1 ? buildLink(page - 1) : null,
    },
  };
}
