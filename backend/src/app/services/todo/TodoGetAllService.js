import Todo from '../../models/ToDos';

export default class TodoGetAllService {
  async index() {
    const contatos = await Todo.findAll();
    return contatos;
  }
}
