/* Prototype only: where the pages find their data and each other.
   The Shopify theme prints the same object with store addresses, so page
   scripts never contain a file path. */
window.LEV_DATA = {
  index: "../catalog/index.json",
  pricing: "../config/pricing.json",
  gallery: "../media/gallery.json",
  mediaBase: "../",
  clipart: "../theme/assets/lev-clipart.json",
  logo: "../theme/assets/lev-logo.png",
  fire: "../theme/assets/lev-fire.webp",
  product: function (sku) { return "../catalog/" + sku + "/product.json"; },
  url: {
    home: "index.html",
    // every category has its own page; with no category this is the full catalog
    catalog: function (cat, sub) { return cat ? "category.html?cat=" + encodeURIComponent(cat) + (sub ? "&sub=" + encodeURIComponent(sub) : "") : "catalog.html"; },
    product: function (sku, colour) { return "product.html?sku=" + encodeURIComponent(sku) + (colour ? "&color=" + encodeURIComponent(colour) : ""); },
    studio: function (sku, colour) { return "studio.html?sku=" + encodeURIComponent(sku) + (colour ? "&color=" + encodeURIComponent(colour) : ""); }
  }
};
