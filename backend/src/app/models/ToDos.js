import Sequelize, { Model } from 'sequelize';

class Todo extends Model {
  static init(sequelize) {
    super.init(
      {
        status: Sequelize.STRING,
        descricao: Sequelize.STRING,
        nome: Sequelize.STRING,
        email: Sequelize.STRING,
        qtd_vezes_pendentes: Sequelize.INTEGER
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Todo;
