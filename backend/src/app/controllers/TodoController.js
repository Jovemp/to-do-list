import TodoSaveService from '../services/todo/TodoSaveSevice';
import TodoGetAllService from '../services/todo/TodoGetAllService';

class TodoController {
  async index(req, res) {
    try {
      const todos = await new TodoGetAllService().index();
      return res.json(todos);
    } catch (erro) {
      if (erro.codigo) {
        return res.status(erro.codigo).json({ erros: erro.message });
      }
      console.log(erro);
      return res.status(401).json({ erros: ['Ocorreu um erro no servidor, tente mais tarde.'] });
    }
  }

  async store(req, res) {
    try {
      const todo = await new TodoSaveService().save(
        req.body
      );
      return res.json(todo);
    } catch (erro) {
      if (erro.codigo) {
        return res.status(erro.codigo).json({ erros: erro.message });
      }
      console.log(erro);
      return res.status(401).json({ erros: ['Ocorreu um erro no servidor, tente mais tarde.'] });
    }
  }
}

export default new TodoController();
