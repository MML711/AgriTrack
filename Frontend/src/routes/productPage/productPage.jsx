import "./productPage.scss";
import React, { useEffect, useRef, useState } from "react";
import Item from "../../components/item/item";
import Modal from "../../components/modal/modal";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addProduct } from "../../redux/cartRedux";
import {
  GoogleMap,
  useJsApiLoader,
  StandaloneSearchBox,
} from "@react-google-maps/api";

function ProductPage() {
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedCropType, setSelectedCropType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  // Get categories based on the selected crop type
  const categories = selectedCropType
    ? availableProducts
        .find((product) => product.cropType === selectedCropType)
        ?.details.map((detail) => detail.category)
    : [];

  // Get products based on the selected category
  const products = selectedCategory
    ? availableProducts
        .find((product) => product.cropType === selectedCropType)
        ?.details.find((detail) => detail.category === selectedCategory)?.data
    : [];

  const [addItem, setAddItem] = useState(null);
  const [clickedItem, setClickedItem] = useState(null);
  const [productList, setProductList] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const dispatch = useDispatch();

  const cropType = useLocation().pathname.split("/")[2];

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(
          cropType === undefined
            ? "http://localhost:3000/api/products"
            : `http://localhost:3000/api/products/${cropType}`
        );
        setProductList(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getProducts();
  }, [cropType]);

  const close = () => {
    setAddItem(null);
    setClickedItem(null);
    setSelectedCropType("");
    setSelectedCategory("");
    setSelectedProduct("");
    setQuantity(1);
    setLocation({});
  };

  const getMyProducts = async () => {
    try {
      const res = await axios.get(
        cropType === undefined
          ? "http://localhost:3000/api/products"
          : `http://localhost:3000/api/products/${cropType}`
      );
      setProductList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = () => {
    dispatch(addProduct({ ...clickedItem, quantity }));

    close();
  };

  const handleAddItem = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/products/formatted"
      );
      setAvailableProducts(res.data);
    } catch (err) {
      console.log(err);
    }

    setAddItem(true);
    console.log(availableProducts);
  };

  const [location, setLocation] = useState({});
  const autocompleteRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_API_KEY,
    libraries: ["places"],
  });

  // Function to apply component restrictions (for Ethiopia)
  const onSearchBoxLoad = (ref) => {
    autocompleteRef.current = ref;
    if (autocompleteRef.current) {
      const options = {
        componentRestrictions: { country: "ET" }, // Restrict to Ethiopia
      };
      autocompleteRef.current.setOptions(options);
    }
  };

  // Track location changes
  useEffect(() => {
    console.log("Updated location:", location);
    console.log("Selected product:", selectedProduct);
  }, [location]); // This effect runs when `location` is updated

  const handleOnPlacesChanged = () => {
    const stockAddress = autocompleteRef.current.getPlaces();
    console.log("address: ", stockAddress);

    const place = stockAddress[0];

    const city =
      place.formatted_address.split(", ")[
        place.formatted_address.split(", ").length - 2
      ]; // get the element second from the last
    const address = place.name;
    const country =
      place.formatted_address.split(", ")[
        place.formatted_address.split(", ").length - 1
      ]; // get the last element

    setLocation({ city, address, country });
    // console.log("location: ", location);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/api/stock", {
        productId: selectedProduct, // Include selected product ID
        amount: quantity,
        location: location,
      });
    } catch (error) {
      console.error("Error sending data:", error);
    }

    close();
  };

  return (
    <div className="container">
      <div className="title">
        <h1>Products</h1>
        <div className="cropType">
          <Link
            to="/products/food-crop"
            {...(cropType === "food-crop"
              ? { style: { backgroundColor: "#293551", color: "white" } }
              : { style: { backgroundColor: "white", color: "#293551" } })}
          >
            <span>Food Crop</span>
          </Link>
          <Link
            to="/products/feed-crop"
            {...(cropType === "feed-crop"
              ? { style: { backgroundColor: "#293551", color: "white" } }
              : { style: { backgroundColor: "white", color: "#293551" } })}
          >
            <span>Feed Crop</span>
          </Link>
          <Link
            to="/products/cash-crop"
            {...(cropType === "cash-crop"
              ? { style: { backgroundColor: "#293551", color: "white" } }
              : { style: { backgroundColor: "white", color: "#293551" } })}
          >
            <span>Cash Crop</span>
          </Link>
          <Link
            to="/products/medicinal-crop"
            {...(cropType === "medicinal-crop"
              ? { style: { backgroundColor: "#293551", color: "white" } }
              : { style: { backgroundColor: "white", color: "#293551" } })}
          >
            <span>Medicinal Crop</span>
          </Link>
          <Link
            to="/products/ornamental-crop"
            {...(cropType === "ornamental-crop"
              ? { style: { backgroundColor: "#293551", color: "white" } }
              : { style: { backgroundColor: "white", color: "#293551" } })}
          >
            <span>Ornamental Crop</span>
          </Link>
        </div>
      </div>
      <div className="buttonWrapper">
        <button>My Products</button>
        <button onClick={handleAddItem}>Add Item</button>
      </div>
      <div className="products">
        {clickedItem && (
          <Modal onClose={close}>
            <div
              style={{
                width: "700px",
                height: "500px",
                display: "flex",
                gap: "40px",
              }}
            >
              <div>
                <h3>{clickedItem.name}</h3>
                <img
                  style={{
                    width: "300px",
                    height: "300px",
                    objectFit: "cover",
                  }}
                  src={
                    clickedItem.pic ||
                    "https://m.media-amazon.com/images/I/515nb4nr3BL.jpg"
                  }
                  alt=""
                />
                <p>Title: {clickedItem.title}</p>
              </div>
              <div>
                <p>Crop Type: {clickedItem.crop_type}</p>
                <p>Category: {clickedItem.category}</p>
                <p>Description: {clickedItem.description}</p>
                <p>Price: ${clickedItem.price}</p>
                <span>Quantity: </span>
                <input
                  type="number"
                  min={1}
                  max={clickedItem.stock_amount}
                  value={quantity}
                  onChange={(e) => setQuantity(+e.target.value)}
                  placeholder="quantity"
                />
              </div>
            </div>
            <button
              style={{
                height: "30px",
                width: "170px",
                color: "white",
                backgroundColor: "#2c4790",
                fontSize: "medium",
                fontWeight: 500,
                cursor: "pointer",
                marginLeft: "600px",
              }}
              onClick={handleClick}
            >
              ADD TO BASKET
            </button>
          </Modal>
        )}
        {addItem && (
          <Modal onClose={close}>
            <div style={{ width: "700px", height: "500px" }}>
              <form onSubmit={handleSubmit}>
                {/* Crop Type Select */}
                <label style={{ marginLeft: "30px" }}>
                  Crop Type:
                  <select
                    value={selectedCropType}
                    onChange={(e) => {
                      setSelectedCropType(e.target.value);
                      setSelectedCategory(""); // Reset category when crop type changes
                      setSelectedProduct(""); // Reset product when crop type changes
                    }}
                  >
                    <option value="">Select Crop Type</option>
                    {availableProducts.map((product) => (
                      <option key={product.cropType} value={product.cropType}>
                        {product.cropName}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Category Select */}
                <label style={{ marginLeft: "30px" }}>
                  Category:
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setSelectedProduct(""); // Reset product when category changes
                    }}
                    disabled={!selectedCropType}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Product Select */}
                <label style={{ marginLeft: "30px" }}>
                  Product:
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    disabled={!selectedCategory}
                  >
                    <option value="">Select Product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Display Selected Product */}
                {selectedProduct && (
                  <div>
                    <h3>Selected Product Details:</h3>
                    {products
                      .filter(
                        (product) => product.id === Number(selectedProduct)
                      )
                      .map((product) => (
                        <div
                          key={product.id}
                          style={{ display: "flex", gap: "40px" }}
                        >
                          <div>
                            <img
                              style={{
                                width: "300px",
                                height: "300px",
                                objectFit: "cover",
                              }}
                              src={product.pic}
                              alt=""
                            />
                            <p>Title: {product.title}</p>
                          </div>
                          <div>
                            <p>Name: {product.name}</p>
                            <p>Description: {product.description}</p>
                            <p>Price: ${product.price}</p>
                            <span>Quantity: </span>
                            <input
                              type="number"
                              min={1}
                              max={250}
                              value={quantity}
                              onChange={(e) => setQuantity(+e.target.value)}
                              placeholder="quantity"
                            />
                            {isLoaded && (
                              <StandaloneSearchBox
                                onLoad={onSearchBoxLoad}
                                onPlacesChanged={handleOnPlacesChanged}
                              >
                                <input
                                  // ref={autocompleteRef}
                                  type="text"
                                  // value={location}
                                  // value={location?.address || ""}
                                  // onChange={(e) => setLocation(e.target.value)}
                                  placeholder="Enter a location"
                                  style={{
                                    width: "100%",
                                    padding: "8px",
                                    marginTop: "20px",
                                  }}
                                />
                              </StandaloneSearchBox>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
                {selectedProduct && (
                  <button
                    type="submit"
                    style={{
                      height: "30px",
                      width: "170px",
                      marginTop: "50px",
                      color: "white",
                      backgroundColor: "#2c4790",
                      fontSize: "medium",
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    Add to Stock
                  </button>
                )}
              </form>
            </div>
          </Modal>
        )}
        {productList.map((item) => (
          <div onClick={() => setClickedItem(item)}>
            <Item key={item.id} itemData={item} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductPage;
