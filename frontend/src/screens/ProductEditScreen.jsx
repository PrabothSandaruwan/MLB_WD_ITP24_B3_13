import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import Loader from "../content/Loader";
import FormContainer from "../content/FormContainer";
import { toast } from "react-toastify";
import {
  useUpdateProductMutation,
  useGetOneProductQuery,
  useUploadProdImageMutation,
} from "../slices/productsApiSlice";
import CurrencyInput from "react-currency-input-field";

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [description, setDescription] = useState("");
  const [err, setErr] = useState("");

  const { data: product, isLoading, error } = useGetOneProductQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const [uploadProdImage, { isLoading: loadImg }] =
    useUploadProdImageMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setImage(product.image);
      setPrice(product.price);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  const validatePrice = (value) => {
    const regex = /^\d+(\.\d{1,2})?$/;
    return regex.test(value) || value === "";
  };

  // const handlePriceChange = (value) => {
  //   //const numericValue = value.replace(/\D/g, '');
  //   setPrice(value);
  // };

  const handlePriceChange = (newValue) => {
    //let newValue = e.target.value;
    if (newValue === "") {
      newValue = 0;
    }
    if (!validatePrice(newValue)) {
      setErr("Please enter a valid price (e.g., 10 or 10.99)");
    } else {
      setErr("");
      setPrice(newValue);
    }
    console.log(newValue);
    setPrice(newValue);
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProdImage(formData).unwrap();
      toast.success(res.message);
      console.log(res.image);
      setImage(res.image);
    } catch (error) {
      toast.error("Image upload failed");
    }

  };

  const validateForm = () => {
    if (
      !name ||
      !price ||
      !brand ||
      !category ||
      !countInStock ||
      !description
    ) {
      setErr("Please fill in all fields.");
      return false;
    }
    if (isNaN(Number(price)) || isNaN(Number(countInStock))) {
      setErr("Price and Stock must be numbers.");
      return false;
    }
    return true;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const updatedProduct = {
      _id: productId,
      name,
      price,
      image,
      brand,
      category,
      countInStock,
      description,
    };

    const result = await updateProduct(updatedProduct);
    if (result.error) {
      console.log(error);
    } else {
      toast.success("Succesfully updated the product ");
      console.log("Successfully updated");
      navigate("/store/admin/items");
    }
  };

  if (isLoading) {
    return <Loader />;
  } else if (error) {
    console.log(error);
    toast.error("Something went wrong");
  } else if (loadingUpdate) {
    return <Loader />;
  }else if (loadImg) {
    return <Loader />;
  }

  console.log(product);

  return (
    <>
      <Link to="/store/admin/items" className="btn btn-light my-3">
        {" "}
        Go back{" "}
      </Link>

      <FormContainer>
        <h1>Edit item details</h1>

        {err && <Alert variant="danger">{err}</Alert>}

        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="price" className="mt-4">
            <Form.Label>Price</Form.Label>

            {/* <Form.Control
              type="text"
              placeholder="Enter price"
              value={price}
              onChange={handlePriceChange}
             
            ></Form.Control> */}

            {/* <CurrencyInput
              className="mx-3"
              //onChange={(e) => handlePriceChange(e.target.value)}
              onValueChange={handlePriceChange}
              val
              decimalScale={2}
              allowDecimals={true}
              suffix=" LKR"
            /> */}

            <CurrencyInput
              className="form-control"
              allowDecimals={true}
              decimalScale={2}
              prefix="LKR "
              value={price}
              onValueChange={handlePriceChange}
            />
          </Form.Group>

          <Form.Group controlId="image">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="text"
              value={image}
              readOnly
            ></Form.Control>
            <Form.Control
              type="file"
              label="Choose a file"
              onChange={uploadFileHandler}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="brand">
            <Form.Label>Brand</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="countInStock">
            <Form.Label>Stock </Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter stock"
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="desription">
            <Form.Label>Desription</Form.Label>
            <Form.Control
              type="text-field"
              placeholder="Enter desription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button type="submit" style={{backgroundColor:"blue",borderWidth:"2px"}} className="my-2">
            Update
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
