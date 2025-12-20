import { Transaction } from 'sequelize';
import { IUrlCreationAttributes, Url } from '../models/IUrl.model';

class UrlRepository {

  create(
    payload: IUrlCreationAttributes,
    transaction?: Transaction,
  ) {
    return Url.create(payload, { transaction });
  }

  updateById(
    id: number,
    payload: Partial<IUrlCreationAttributes>,
    transaction?: Transaction,
  ) {
    return Url.update(payload, {
      where: { id },
      transaction,
    });
  }

  findByShortCode(shortCode: string) {
    return Url.findOne({
      where: {
        short_code: shortCode,
        is_active: true,
      },
    });
  }

  findById(id: number) {
    return Url.findByPk(id);
  }

  deactivate(id: number) {
    return Url.update(
      { is_active: false },
      { where: { id } },
    );
  }
}

export const urlRepository = new UrlRepository();
