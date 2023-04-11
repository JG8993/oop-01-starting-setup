class Product {
  // title = "DEFAULT";
  // imageUrl;
  // description;
  // price;

  constructor(title, image, desc, price) {
    this.title = title;
    this.imageUrl = image;
    this.description = desc;
    this.price = price;
  }
}

class ElementAttribute {
  constructor(attrName, attrValue) {
    this.name = attrName;
    this.value = attrValue;
  }
}

class Component {
  constructor(renderHookId, shouldRender = true) {
    this.hookId = renderHookId;
    if (shouldRender) {
      this.render();
    }
  }

  render() {}

  createRootElement(tag, cssClasses, attributes) {
    const rootElement = document.createElement(tag);
    if (cssClasses) {
      rootElement.className = cssClasses;
    }
    if (attributes && attributes.length > 0) {
      for (const attr of attributes) {
        rootElement.setAttribute(attr.name, attr.value);
      }
    }
    document.getElementById(this.hookId).append(rootElement);
    return rootElement;
  }
}

class ShoppingCart extends Component {
  items = [];
  constructor(renderHookId) {
    super(renderHookId, false);
    this.orderProducts = () => {
      console.log("Ordering...");
      console.log(this.items);
    };
    this.render();
  }

  set cartItems(value) {
    this.items = value;
    this.totalOutput.innerHTML = `<h2>Total: \$${this.totalAmount.toFixed(
      2
    )}</h2>`;
  }

  get totalAmount() {
    const sum = this.items.reduce((prevValue, curItem) => {
      return prevValue + curItem.price;
    }, 0);
    return sum;
  }

  addProduct(product) {
    const updatedItems = [...this.items];
    updatedItems.push(product);
    this.cartItems = updatedItems;
  }

  render() {
    const cartEl = this.createRootElement("section", "cart");
    cartEl.innerHTML = `
        <h2>Total: \$${0}</h2>
        <button>Order Now!</button>
        `;
    const orderButton = cartEl.querySelector("button");
    orderButton.addEventListener("click", this.orderProducts);
    this.totalOutput = cartEl.querySelector("h2");
  }
}

class ProductItem extends Component {
  constructor(product, renderHookId) {
    super(renderHookId, false);
    this.product = product;
    this.render();
  }

  addToCart() {
    App.addProductToCart(this.product);
  }
  render() {
    const prodEl = this.createRootElement("li", "product-item");
    prodEl.innerHTML = `
            <div>
            <img src="${this.product.imageUrl}" alter="${this.product.title}">
            <div class="product-item__content">
            <h2>${this.product.title}</h2>
            <h3>\$${this.product.price}</h3>
            <p>${this.product.description}</p>
            <button>Add to Cart</button>
            </div>
            </div>`;
    const addCartButton = prodEl.querySelector("button");
    addCartButton.addEventListener("click", this.addToCart.bind(this));
  }
}

class ProductList extends Component {
  #products = [];
  constructor(renderHookId) {
    super(renderHookId, false);
    this.render();
    this.fetchProducts();
  }

  fetchProducts() {
    this.#products = [
      new Product(
        "A Pillow",
        "https://images-us-prod.cms.dynamics365commerce.ms/cms/api/cncgmclkfv/imageFileData/search?fileName=/Products%2F140091P%20%5E%20%20%5E%20Std%20Queen%20%5E%20%20%5E%20Prime_000_001.png&fallback=/Products/140091P_000_001.png,Product-Fallback-Image.png&m=6&q=80&cropfocalregion=true",
        "Crazy comfy pillow!",
        139.99
      ),
      new Product(
        "A Carpet",
        "https://www.claremontrug.com/antique-oriental-rugs-carpets/images_rugs/6944/Antique-Persian-Tabriz-Rug-11x16-1.SGE4.SINGLE.jpg",
        "Put your room in the spotlight with this shiny carpet!",
        89.99
      ),
    ];
    this.renderProducts();
  }

  renderProducts() {
    for (const prod of this.#products) {
      new ProductItem(prod, "prod-list");
    }
  }

  render() {
    this.createRootElement("ul", "product-list", [
      new ElementAttribute("id", "prod-list"),
    ]);
    if (this.#products && this.#products.length > 0) {
      this.renderProducts();
    }
  }
}

class Shop extends Component {
  constructor() {
    super();
  }
  render() {
    this.cart = new ShoppingCart("app");
    new ProductList("app");
  }
}

class App {
  static cart;
  static init() {
    const shop = new Shop();
    this.cart = shop.cart;
  }

  static addProductToCart(product) {
    this.cart.addProduct(product);
  }
}

App.init();
