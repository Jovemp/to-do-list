import * as Yup from 'yup';
import ErroException from '../../errors/ErroException';
import Todo from '../../models/ToDos';
import axios from 'axios';

export default class TodoSaveService {
  async save(todos) {
    const schema = Yup.array()
      .of(Yup.object().shape({
        id: Yup.number(),
        descricao: Yup.string()
          .min(3)
          .required(),
        nome: Yup.string()
          .min(1)
          .max(100)
          .required(),
        email: Yup.string()
          .min(3)
          .max(100)
          .required()
      }));

    if (
      !(await schema.isValid(todos))
    ) {
      try {
        await schema.validate(todos);
      } catch (erro) {
        throw new ErroException(400, erro.errors);
      }
    }

    const t = await Todo.sequelize.transaction();
    const resp = [];

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    try {
      for (let i = 0; i < todos.length; i++) {

        const {
          id,
          descricao,
          nome,
          email,
          status
        } = todos[i];

        if (id) {
          const tod = await Todo.findOne({ where: { id } });

          if (!tod) {
            throw new ErroException(404, ['Tarefa não encontrada.']);
          }

          if (email) {
            if (tod.email != email) {
              const api = axios.create();
              await sleep(500);
              const response = await api.get(`https://apilayer.net/api/check?access_key=${process.env.KEY_MAIL}&email=${email}`);

              const data = response.data;
              if (data) {
                if (data.success) {
                  if (!data.format_valid) {
                    throw new ErroException(400, [`Email invalido, email de exemplo ${data.did_you_mean}`])
                  }
                  if (!data.mx_found) {
                    throw new ErroException(400, [`Email não é mx, email de exemplo ${data.did_you_mean}`])
                  }
                } else {
                  throw new ErroException(400, ['Erro ao validar o email.']);
                }
              } else {
                throw new ErroException(400, ['Erro ao validar o email.']);
              }
            }
          }

          let qtdAlteracao = tod.qtd_vezes_pendentes;
          if (status) {
            if (status == "PENDENTE" && tod.status == "CONCLUIDO") {
              qtdAlteracao += 1;
            }
          }

          if (qtdAlteracao >= 3) {
            throw new ErroException(400, ['Não é possivel colocar mais a tarefa em pendente.']);
          }

          const {
            status: st,
            descricao: de,
            nome: no,
            email: em,
            qtd_vezes_pendentes: qt
          } = await tod.update({
            status,
            descricao,
            nome,
            email,
            qtd_vezes_pendentes: qtdAlteracao
          });

          resp.push({
            id,
            status: st,
            descricao: de,
            nome: no,
            email: em,
            qtd_vezes_pendentes: qt
          });
        } else {

          const api = axios.create();
          const response = await api.get(`https://apilayer.net/api/check?access_key=${process.env.KEY_MAIL}&email=${email}`);

          const data = response.data;
          if (data) {
            if (data.success) {
              throw new ErroException(400, ['Erro ao validar o email.']);
            }
            if (!data.format_valid) {
              throw new ErroException(400, [`Email invalido, email de exemplo ${data.did_you_mean}`])
            }
            if (!data.mx_found) {
              throw new ErroException(400, [`Email não é mx, email de exemplo ${data.did_you_mean}`])
            }
          } else {
            throw new ErroException(400, ['Erro ao validar o email.']);
          }

          const { id } = await Todo.create({
            status: "PENDENTE",
            descricao,
            nome,
            email,
            qtd_vezes_pendentes: 0
          }, { transaction: t });

          resp.push({
            id,
            status,
            descricao,
            nome,
            email,
            qtd_vezes_pendentes: 0
          })

        }
      }
      await t.commit();
    } catch (erro) {
      await t.rollback();
      throw new ErroException(400, erro.message);
    }

    return resp;
  }

  
}
