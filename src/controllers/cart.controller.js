import productsDao from "../daos/dbManager/products.dao.js";
import ProductDto from "../daos/dtos/products.dtos.js";

class CartController {
  async getProducts(req, res) {
    try {
      const products = await productsDao.getAll();
      res.json({ user: req.user, products });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProduct(req, res) {
    try {
      const product = await productsDao.getById(req.params.id);
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createProduct(req, res) {
    try {
      const product = new ProductDto(req.body); 
      await productsDao.create(product);
      // res.json(product);
      res.redirect("/products");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  
  async updateProduct(req, res) {
    try {
      const product = await productsDao.update(req.params.id, req.body);
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      const product = await productsDao.delete(req.params.id);
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

const addProductCart = async (req, res) => {
    const { title, description, price, stock } = req.body;
  
    const estaEnProducts = await Product.findOne({ stock });

    const estaEnElCarrito = await Cart.findOne({ title });
  
    if (!estaEnProducts) {
      res.status(400).json({
        mensaje: "Este producto no se encuentra en nuestro stock",
      });
  
    } else if (noEstaVacio && !estaEnElCarrito) {
      const newProductInCart = new Cart({ title, description, price, stock: 1 });
  
      await Product.findByIdAndUpdate(
        estaEnProducts?._id,
        { inCart: true, title, description, price, stock },
        { new: true }
      )
        .then((product) => {
          newProductInCart.save();
          res.json({
            mensaje: `El producto fue agregado al carrito`,
            product,
          });
        })
        .catch((error) => console.error(error));
  
    } else if (estaEnElCarrito) {
      res.status(400).json({
        mensaje: "El producto ya esta en el carrito",
      });
    }
  };

export default new CartController();