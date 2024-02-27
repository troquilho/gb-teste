import CategoriaModel from '../models/categoriaModel.js';

async function getCategorias(db, { paginate, page, limit }) {
    const categoriaModel = new CategoriaModel(db);
    return await categoriaModel.findAll({ paginate, page, limit });
}

async function createCategoria(db, { nome_categoria, descricao_categoria }) {
    const categoriaModel = new CategoriaModel(db);
    return await categoriaModel.create({ nome_categoria, descricao_categoria });
}

async function updateCategoria(db, id, { nome_categoria, descricao_categoria }) {
    const categoriaModel = new CategoriaModel(db);
    return await categoriaModel.update(id, { nome_categoria, descricao_categoria });
}

async function deleteCategoria(db, id) {
    const categoriaModel = new CategoriaModel(db);
    return await categoriaModel.delete(id);
}

export { getCategorias, createCategoria, updateCategoria, deleteCategoria };