# api.azin.geraint [BACK-END]

# E-Commerce Product Management System Documentation

## Overview
This documentation provides an overview of the **Product Management System** for the e-commerce platform. It covers the essential parts of the project, including models, controllers, services, and APIs for managing products. The system supports product creation, retrieval, update, deletion, and secure access via token-based authentication.

## Table of Contents
1. [Project Structure](#project-structure)
2. [Models](#models)
    - [User Model](#user-model)
    - [Product Model](#product-model)
3. [Controllers](#controllers)
    - [Product Controller](#product-controller)
4. [Services](#services)
    - [Product Service](#product-service)
5. [Authentication](#authentication)
6. [API Routes](#api-routes)
7. [Error Handling](#error-handling)
8. [Token Authentication](#token-authentication)
9. [Example Flow](#example-flow)

---

## Project Structure

The project follows a modular structure with separate files for controllers, services, and models. Key components include:

- **Controllers**: Handle HTTP requests and responses.
- **Services**: Contain business logic and interact with databases.
- **Models**: Define the data structure (e.g., Product, User).

---

## Models

### User Model

The **User** model stores user data, including roles like **admin**, **seller**, and **customer**.

#### Fields:
- `id`: Primary Key
- `username`: Unique
- `email`: Unique
- `password`: Hashed
- `role`: Enum with `admin`, `seller`, `customer`
- `is_active`: Boolean (True/False)
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Product Model

The **Product** model defines the product details that can be managed by users.

#### Fields:
- `id`: Primary Key
- `title`: Product title
- `description`: Product description
- `price`: Price of the product
- `category`: Product category
- `created_by`: Foreign Key (User)
- `created_at`: Timestamp
- `updated_at`: Timestamp

---

## Controllers

### Product Controller

The `ProductController` is responsible for handling HTTP requests related to products. It maps incoming requests to appropriate service methods.

#### Dependencies:
- **ProductService**: Handles the business logic for product management.
- **autoBind**: Automatically binds controller methods to the class instance.

#### Routes:

- **POST `/create-product`**: Create a new product.
- **PUT `/update-product/:productId`**: Update product details by ID.
- **GET `/get-products`**: Fetch a list of all products.
- **GET `/get-product`**: Fetch a product by ID.
- **DELETE `/delete-product`**: Delete a product by ID.

Each route corresponds to a method in the `ProductController`, which delegates business logic to the `ProductService`.

---

## Services

### Product Service

The `ProductService` contains the core logic for managing products, interacting with the database.

#### Methods:
- **getAllProduct(page: number, limit: number)**: Retrieves all products with pagination support.
- **getProductById(productId: string)**: Fetches a product by ID.
- **createProduct(productData: object)**: Creates a new product.
- **updateProductById(productId: string, productData: object)**: Updates a product by ID.
- **deleteProductById(productId: string)**: Deletes a product by ID.

---

## Authentication

Token-based authentication is used throughout the system to ensure secure access. JWT tokens are required for users to interact with the product endpoints.

- **Login**: Upon successful login, a JWT token is issued.
- **Authorization**: Every route (except product creation) requires an authenticated token.

---

## API Routes

The following API routes are implemented for product management:

### **POST `/create-product`**
Creates a new product.

**Payload Example**:
```json
{
    "title": "Product Title",
    "description": "Product Description",
    "price": 100,
    "category": "Category Name"
}
