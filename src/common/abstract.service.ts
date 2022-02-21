import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PaginatedResult } from './paginated-result.interface';

@Injectable()
export abstract class AbstractService {

    protected constructor(
        protected readonly repository: Repository<any>
    ) {

    }

    async all(relations = []): Promise<any[]> {
        return this.repository.find({relations});
    }

    async paginate(page = 1, relations = []): Promise<PaginatedResult> {
        // mau ambil berapa data per-page
        const take = 3;

        const [data, total] = await this.repository.findAndCount({
            take,
            // skip -> offset, jika kita ada di page 1, return zero. kalau lagi di page 2, kita add sebanyakan user yang ada
            skip: (page - 1) * take, // belum paham
            relations
        });

        return {
            data: data,
            // meta -> untuk passing beberapa data
            meta: {
                total,
                page,
                last_page: Math.ceil(total / take)
            }
        }
    }

    async create(data): Promise<any> {
        return this.repository.save(data);
    }

    async findOne(condition, relations = []): Promise<any> {
        return this.repository.findOne(condition, {relations});
    }

    async update(id: number, data): Promise<any> {
        return this.repository.update(id, data);
    } 

    async delete(id: number): Promise<any> {
        return this.repository.delete(id);
    }
}
