"use client";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiSearch, FiFilter, FiImage, FiPackage, FiPercent, FiTag, FiFileText, FiCheckSquare, FiGrid, FiList, FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from "react-icons/fi";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  category: string;
  images: string[];
  selected: boolean;
  createdAt: string | Date;
};

const EcommercePage = () => {
  const [categories, setCategories] = useState<string[]>([
    "Grocery",
    "Electronics",
    "Books",
    "Clothing",
    "Beauty",
    "Games",
    "Baby Products",
    "Accessories",
    "Pet Supplies",
    "Jewelry",
    "Footwear",
    "Bag"
  ]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 20;
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    originalPrice: "",
    price: "",
    discount: 0,
    category: "Grocery",
    images: [] as File[],
  });

  // Extract unique categories from products
  const extractCategoriesFromProducts = (products: Product[]) => {
    const uniqueCategories = new Set<string>();
    products.forEach((product) => uniqueCategories.add(product.category));
    return Array.from(uniqueCategories);
  };

  // Fetch products from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const productsRes = await axios.get("http://localhost:5000/api/groceries");
        const productsWithDates = productsRes.data.map((product: Product) => ({
          ...product,
          selected: false,
          createdAt: new Date(product.createdAt),
        }));
        setProducts(productsWithDates);
        
        // Extract categories from products and merge with default categories
        const extractedCategories = extractCategoriesFromProducts(productsWithDates);
        const mergedCategories = [...new Set([...categories, ...extractedCategories])];
        setCategories(mergedCategories);
      } catch (err) {
        setError("Failed to fetch products");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const discount = useMemo(() => {
    if (!formData.price || !formData.originalPrice) return 0;
    const original = parseFloat(formData.originalPrice);
    const selling = parseFloat(formData.price);
    return original > 0
      ? Math.round(((original - selling) / original) * 100)
      : 0;
  }, [formData.price, formData.originalPrice]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 5);
      setFormData((prev) => ({
        ...prev,
        images: files,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("originalPrice", formData.originalPrice);
      formDataToSend.append("discount", discount.toString());
      formDataToSend.append("category", formData.category);
      formData.images.forEach((file) => {
        formDataToSend.append("images", file);
      });
      
      if (editingProductId) {
        const { data } = await axios.put(
          `http://localhost:5000/api/groceries/${editingProductId}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setProducts(
          products.map((product) =>
            product._id === editingProductId
              ? { ...data, selected: false, createdAt: new Date(data.createdAt) }
              : product
          )
        );
        setEditingProductId(null);
      } else {
        const { data } = await axios.post(
          "http://localhost:5000/api/groceries",
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setProducts([
          { ...data, selected: false, createdAt: new Date(data.createdAt) },
          ...products,
        ]);
        setCurrentPage(1);
      }
      setFormData({
        name: "",
        description: "",
        originalPrice: "",
        price: "",
        discount: 0,
        category: "Grocery",
        images: [],
      });
    } catch (err) {
      setError("Failed to save product");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelect = (id: string) => {
    setProducts(
      products.map((product) =>
        product._id === id
          ? { ...product, selected: !product.selected }
          : product
      )
    );
  };

  const toggleSelectAll = () => {
    const allSelected = currentProducts.every(product => product.selected);
    setProducts(
      products.map(product => ({
        ...product,
        selected: allSelected ? false : true
      }))
    );
  };

  const deleteSelected = async () => {
    try {
      setIsLoading(true);
      const selectedIds = products
        .filter((product) => product.selected)
        .map((product) => product._id);
      await axios.post("http://localhost:5000/api/groceries/delete-selected", {
        ids: selectedIds,
      });
      setProducts(products.filter((product) => !product.selected));
      setCurrentPage(1);
    } catch (err) {
      setError("Failed to delete selected products");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setIsLoading(true);
      await axios.delete(`http://localhost:5000/api/groceries/${id}`);
      setProducts(products.filter((product) => product._id !== id));
    } catch (err) {
      setError("Failed to delete product");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let result = products;
    
    if (filter !== "All") {
      result = result.filter((product) => product.category === filter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [products, filter, searchQuery]);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
          pageNumbers.push('...');
        }
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push('...');
        }
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  if (isLoading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading products...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-red-500 text-5xl mb-4 text-center">⚠️</div>
          <div className="text-xl font-semibold text-red-500 text-center">{error}</div>
          <button 
            className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-9xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-blue-600 text-white p-2 rounded-lg mr-3">
              <FiPackage size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          </div>
          <div className="text-sm text-gray-500">
            Admin Panel
          </div>
        </div>
      </header>

      <main className="max-w-9xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left: Add/Update Product Section */}
            <div className="w-full lg:w-2/5 p-8 border-b lg:border-b-0 lg:border-r border-gray-200">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                  {editingProductId ? <FiEdit2 size={20} /> : <FiPlus size={20} />}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingProductId ? "Update Product" : "Add New Product"}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FiPackage className="mr-2" /> Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="Enter product name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FiTag className="mr-2" /> Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    required
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FiFileText className="mr-2" /> Product Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="Enter product description"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <span className="mr-2">₹</span> Original Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <span className="mr-2">₹</span> Selling Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <FiPercent className="mr-2" /> Discount (%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={discount}
                        readOnly
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-600"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                        <FiPercent />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FiImage className="mr-2" /> Product Images (Max 5) <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      required={!editingProductId && formData.images.length === 0}
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <FiImage className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        <span className="font-medium text-blue-600 hover:text-blue-500">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5 files</p>
                    </label>
                  </div>
                  {formData.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {Array.from(formData.images).map((file, index) => (
                        <div key={index} className="bg-gray-100 rounded-lg p-2 text-sm text-gray-600 truncate">
                          {file.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : editingProductId ? (
                      <>
                        <FiSave className="mr-2" /> Update Product
                      </>
                    ) : (
                      <>
                        <FiPlus className="mr-2" /> Add Product
                      </>
                    )}
                  </button>
                  
                  {editingProductId && (
                    <button
                      type="button"
                      className="bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-semibold hover:bg-gray-300 transition flex items-center justify-center"
                      onClick={() => {
                        setEditingProductId(null);
                        setFormData({
                          name: "",
                          description: "",
                          originalPrice: "",
                          price: "",
                          discount: 0,
                          category: "Grocery",
                          images: [],
                        });
                      }}
                    >
                      <FiX className="mr-2" /> Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
            
            {/* Right: View Products Section */}
            <div className="w-full lg:w-3/5 p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                    <FiPackage size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Product List</h2>
                  <span className="ml-3 bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {products.length} items
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 min-w-[200px]">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FiSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50 transition flex items-center"
                      onClick={deleteSelected}
                      disabled={!products.some((p) => p.selected) || isLoading}
                    >
                      <FiTrash2 className="mr-2" />
                      <span className="hidden sm:inline">Delete Selected</span>
                    </button>
                    
                    <div className="relative">
                      <select
                        value={filter}
                        onChange={(e) => {
                          setFilter(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="All">All Categories</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <FiFilter />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex justify-end mb-4">
                <div className="inline-flex rounded-md shadow-sm" role="group">
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                      viewMode === 'table'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setViewMode('table')}
                  >
                    <FiList className="inline mr-2" /> Table View
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                      viewMode === 'grid'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setViewMode('grid')}
                  >
                    <FiGrid className="inline mr-2" /> Grid View
                  </button>
                </div>
              </div>
              
              {/* Product List - Table View */}
              {viewMode === 'table' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                            checked={currentProducts.length > 0 && currentProducts.every(product => product.selected)}
                            onChange={toggleSelectAll}
                          />
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Discount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Images
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentProducts.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                            {searchQuery || filter !== "All" 
                              ? "No products match your search criteria" 
                              : "No products found"}
                          </td>
                        </tr>
                      ) : (
                        currentProducts.map((product) => (
                          <tr key={product._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                checked={product.selected}
                                onChange={() => toggleSelect(product._id)}
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{product.category}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">₹{product.price.toFixed(2)}</div>
                              {product.originalPrice > product.price && (
                                <div className="text-sm text-gray-500 line-through">₹{product.originalPrice.toFixed(2)}</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {product.discount > 0 ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  {product.discount}% off
                                </span>
                              ) : (
                                <span className="text-sm text-gray-500">No discount</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex space-x-1">
                                {product.images.slice(0, 3).map((img, index) => (
                                  <img
                                    key={index}
                                    src={`http://localhost:5000${img}`}
                                    alt={product.name}
                                    className="h-8 w-8 rounded object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = "/placeholder-product.jpg";
                                    }}
                                  />
                                ))}
                                {product.images.length > 3 && (
                                  <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                                    +{product.images.length - 3}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                className="text-blue-600 hover:text-blue-900 mr-3"
                                onClick={() => {
                                  setFormData({
                                    name: product.name,
                                    description: product.description,
                                    originalPrice: product.originalPrice.toString(),
                                    price: product.price.toString(),
                                    discount: product.discount,
                                    category: product.category,
                                    images: [],
                                  });
                                  setEditingProductId(product._id);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                disabled={isLoading}
                              >
                                <FiEdit2 />
                              </button>
                              <button
                                className="text-red-600 hover:text-red-900"
                                onClick={() => deleteProduct(product._id)}
                                disabled={isLoading}
                              >
                                <FiTrash2 />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              
              {/* Product List - Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentProducts.length === 0 ? (
                    <div className="col-span-2 text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <FiPackage size={48} className="mx-auto" />
                      </div>
                      <div className="text-gray-500">
                        {searchQuery || filter !== "All" 
                          ? "No products match your search criteria" 
                          : "No products found"}
                      </div>
                    </div>
                  ) : (
                    currentProducts.map((product) => (
                      <div
                        key={product._id}
                        className="p-4 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start">
                          <input
                            type="checkbox"
                            checked={product.selected}
                            onChange={() => toggleSelect(product._id)}
                            className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <div className="ml-4 flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-bold text-gray-900 text-lg">
                                  {product.name}
                                </div>
                                <div className="text-gray-500 text-sm font-medium mt-1">
                                  {product.category}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-gray-900 font-bold text-lg">
                                  ₹{product.price.toFixed(2)}
                                </div>
                                {product.originalPrice > product.price && (
                                  <div className="text-gray-500 text-sm line-through">
                                    ₹{product.originalPrice.toFixed(2)}
                                  </div>
                                )}
                                {product.discount > 0 && (
                                  <div className="text-green-600 text-sm font-medium mt-1">
                                    {product.discount}% off
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-gray-600 text-sm mt-3 line-clamp-2">
                              {product.description}
                            </div>
                            
                            {product.images.length > 0 && (
                              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                                {product.images.slice(0, 3).map((img, index) => (
                                  <img
                                    key={index}
                                    src={`http://localhost:5000${img}`}
                                    alt={product.name}
                                    className="w-16 h-16 object-cover rounded border border-gray-200 flex-shrink-0"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = "/placeholder-product.jpg";
                                    }}
                                  />
                                ))}
                                {product.images.length > 3 && (
                                  <div className="w-16 h-16 rounded border border-gray-200 bg-gray-100 flex items-center justify-center text-gray-500 text-sm flex-shrink-0">
                                    +{product.images.length - 3}
                                  </div>
                                )}
                              </div>
                            )}
                            
                            <div className="flex gap-3 mt-4">
                              <button
                                className="text-blue-600 hover:text-blue-800 font-medium flex items-center text-sm"
                                onClick={() => {
                                  setFormData({
                                    name: product.name,
                                    description: product.description,
                                    originalPrice: product.originalPrice.toString(),
                                    price: product.price.toString(),
                                    discount: product.discount,
                                    category: product.category,
                                    images: [],
                                  });
                                  setEditingProductId(product._id);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                disabled={isLoading}
                              >
                                <FiEdit2 className="mr-1" /> Edit
                              </button>
                              <button
                                className="text-red-600 hover:text-red-800 font-medium flex items-center text-sm"
                                onClick={() => deleteProduct(product._id)}
                                disabled={isLoading}
                              >
                                <FiTrash2 className="mr-1" /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
                  <div className="text-sm text-gray-500">
                    Showing {indexOfFirstProduct + 1} to{" "}
                    {Math.min(indexOfLastProduct, sortedProducts.length)} of{" "}
                    {sortedProducts.length} products
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={currentPage === 1 || isLoading}
                      onClick={() => setCurrentPage(1)}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-100 transition"
                      title="First Page"
                    >
                      <FiChevronsLeft />
                    </button>
                    <button
                      disabled={currentPage === 1 || isLoading}
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-100 transition"
                      title="Previous Page"
                    >
                      <FiChevronLeft />
                    </button>
                    
                    <div className="flex gap-1">
                      {getPageNumbers().map((page, index) => (
                        typeof page === 'number' ? (
                          <button
                            key={index}
                            className={`w-10 h-10 rounded-lg ${
                              currentPage === page
                                ? "bg-blue-500 text-white"
                                : "border border-gray-300 hover:bg-gray-100"
                            }`}
                            onClick={() => setCurrentPage(page)}
                            disabled={isLoading}
                          >
                            {page}
                          </button>
                        ) : (
                          <span key={index} className="flex items-center px-2">
                            {page}
                          </span>
                        )
                      ))}
                    </div>
                    
                    <button
                      disabled={currentPage === totalPages || isLoading}
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-100 transition"
                      title="Next Page"
                    >
                      <FiChevronRight />
                    </button>
                    <button
                      disabled={currentPage === totalPages || isLoading}
                      onClick={() => setCurrentPage(totalPages)}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-100 transition"
                      title="Last Page"
                    >
                      <FiChevronsRight />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EcommercePage;

// "use client";
// import React, { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiSearch, FiFilter, FiImage, FiPackage, FiDollarSign, FiPercent, FiTag, FiFileText, FiCheckSquare, FiGrid, FiList, FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from "react-icons/fi";

// type Product = {
//   _id: string;
//   name: string;
//   description: string;
//   price: number;
//   originalPrice: number;
//   discount: number;
//   category: string;
//   images: string[];
//   selected: boolean;
//   createdAt: string | Date;
// };

// const EcommercePage = () => {
//   const [categories, setCategories] = useState<string[]>(["Electronics", "Clothing", "Home", "Books", "Grocery"]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [filter, setFilter] = useState<string>("All");
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const productsPerPage = 20; // Increased for better handling of large catalogs
//   const [editingProductId, setEditingProductId] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [viewMode, setViewMode] = useState<'grid' | 'table'>('table'); // Default to table for large catalogs
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     originalPrice: "",
//     price: "",
//     discount: 0,
//     category: "Electronics", // Default category
//     images: [] as File[],
//   });

//   // Extract unique categories from products
//   const extractCategoriesFromProducts = (products: Product[]) => {
//     const uniqueCategories = new Set<string>();
//     products.forEach((product) => uniqueCategories.add(product.category));
//     return Array.from(uniqueCategories);
//   };

//   // Fetch products from backend
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         const productsRes = await axios.get("http://localhost:5000/api/groceries");
//         const productsWithDates = productsRes.data.map((product: Product) => ({
//           ...product,
//           selected: false,
//           createdAt: new Date(product.createdAt),
//         }));
//         setProducts(productsWithDates);
        
//         // Extract categories from products
//         const extractedCategories = extractCategoriesFromProducts(productsWithDates);
//         if (extractedCategories.length > 0) {
//           // Merge with default categories
//           const mergedCategories = [...new Set([...categories, ...extractedCategories])];
//           setCategories(mergedCategories);
//         }
//       } catch (err) {
//         setError("Failed to fetch products");
//         console.error(err);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const discount = useMemo(() => {
//     if (!formData.price || !formData.originalPrice) return 0;
//     const original = parseFloat(formData.originalPrice);
//     const selling = parseFloat(formData.price);
//     return original > 0
//       ? Math.round(((original - selling) / original) * 100)
//       : 0;
//   }, [formData.price, formData.originalPrice]);

//   const handleInputChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const files = Array.from(e.target.files).slice(0, 5);
//       setFormData((prev) => ({
//         ...prev,
//         images: files,
//       }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append("name", formData.name);
//       formDataToSend.append("description", formData.description);
//       formDataToSend.append("price", formData.price);
//       formDataToSend.append("originalPrice", formData.originalPrice);
//       formDataToSend.append("discount", discount.toString());
//       formDataToSend.append("category", formData.category);
//       formData.images.forEach((file) => {
//         formDataToSend.append("images", file);
//       });
      
//       if (editingProductId) {
//         // Update existing product
//         const { data } = await axios.put(
//           `http://localhost:5000/api/groceries/${editingProductId}`,
//           formDataToSend,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );
//         setProducts(
//           products.map((product) =>
//             product._id === editingProductId
//               ? { ...data, selected: false, createdAt: new Date(data.createdAt) }
//               : product
//           )
//         );
//         setEditingProductId(null);
//       } else {
//         // Add new product
//         const { data } = await axios.post(
//           "http://localhost:5000/api/groceries",
//           formDataToSend,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );
//         setProducts([
//           { ...data, selected: false, createdAt: new Date(data.createdAt) },
//           ...products,
//         ]);
//         setCurrentPage(1);
//       }
//       // Reset form
//       setFormData({
//         name: "",
//         description: "",
//         originalPrice: "",
//         price: "",
//         discount: 0,
//         category: "Electronics",
//         images: [],
//       });
//     } catch (err) {
//       setError("Failed to save product");
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const toggleSelect = (id: string) => {
//     setProducts(
//       products.map((product) =>
//         product._id === id
//           ? { ...product, selected: !product.selected }
//           : product
//       )
//     );
//   };

//   const toggleSelectAll = () => {
//     const allSelected = currentProducts.every(product => product.selected);
//     setProducts(
//       products.map(product => ({
//         ...product,
//         selected: allSelected ? false : true
//       }))
//     );
//   };

//   const deleteSelected = async () => {
//     try {
//       setIsLoading(true);
//       const selectedIds = products
//         .filter((product) => product.selected)
//         .map((product) => product._id);
//       await axios.post("http://localhost:5000/api/groceries/delete-selected", {
//         ids: selectedIds,
//       });
//       setProducts(products.filter((product) => !product.selected));
//       setCurrentPage(1);
//     } catch (err) {
//       setError("Failed to delete selected products");
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const deleteProduct = async (id: string) => {
//     try {
//       setIsLoading(true);
//       await axios.delete(`http://localhost:5000/api/groceries/${id}`);
//       setProducts(products.filter((product) => product._id !== id));
//     } catch (err) {
//       setError("Failed to delete product");
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const filteredProducts = useMemo(() => {
//     let result = products;
    
//     // Apply category filter
//     if (filter !== "All") {
//       result = result.filter((product) => product.category === filter);
//     }
    
//     // Apply search filter
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       result = result.filter(
//         (product) =>
//           product.name.toLowerCase().includes(query) ||
//           product.description.toLowerCase().includes(query) ||
//           product.category.toLowerCase().includes(query)
//       );
//     }
    
//     return result;
//   }, [products, filter, searchQuery]);

//   const sortedProducts = [...filteredProducts].sort((a, b) => {
//     const dateA = new Date(a.createdAt).getTime();
//     const dateB = new Date(b.createdAt).getTime();
//     return dateB - dateA;
//   });

//   const indexOfLastProduct = currentPage * productsPerPage;
//   const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
//   const currentProducts = sortedProducts.slice(
//     indexOfFirstProduct,
//     indexOfLastProduct
//   );

//   const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

//   // Pagination controls
//   const getPageNumbers = () => {
//     const pageNumbers = [];
//     const maxVisiblePages = 5;
    
//     if (totalPages <= maxVisiblePages) {
//       for (let i = 1; i <= totalPages; i++) {
//         pageNumbers.push(i);
//       }
//     } else {
//       const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
//       const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
//       if (startPage > 1) {
//         pageNumbers.push(1);
//         if (startPage > 2) {
//           pageNumbers.push('...');
//         }
//       }
      
//       for (let i = startPage; i <= endPage; i++) {
//         pageNumbers.push(i);
//       }
      
//       if (endPage < totalPages) {
//         if (endPage < totalPages - 1) {
//           pageNumbers.push('...');
//         }
//         pageNumbers.push(totalPages);
//       }
//     }
    
//     return pageNumbers;
//   };

//   if (isLoading && products.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
//           <div className="text-xl font-semibold text-gray-700">Loading products...</div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
//           <div className="text-red-500 text-5xl mb-4 text-center">⚠️</div>
//           <div className="text-xl font-semibold text-red-500 text-center">{error}</div>
//           <button 
//             className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
//             onClick={() => window.location.reload()}
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b border-gray-200">
//         <div className="max-w-9xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
//           <div className="flex items-center">
//             <div className="bg-blue-600 text-white p-2 rounded-lg mr-3">
//               <FiPackage size={24} />
//             </div>
//             <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
//           </div>
//           <div className="text-sm text-gray-500">
//             Admin Panel
//           </div>
//         </div>
//       </header>

//       <main className="max-w-9xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//           <div className="flex flex-col lg:flex-row">
//             {/* Left: Add/Update Product Section */}
//             <div className="w-full lg:w-2/5 p-8 border-b lg:border-b-0 lg:border-r border-gray-200">
//               <div className="flex items-center mb-6">
//                 <div className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
//                   {editingProductId ? <FiEdit2 size={20} /> : <FiPlus size={20} />}
//                 </div>
//                 <h2 className="text-2xl font-bold text-gray-800">
//                   {editingProductId ? "Update Product" : "Add New Product"}
//                 </h2>
//               </div>
              
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
//                     <FiPackage className="mr-2" /> Product Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//                     placeholder="Enter product name"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
//                     <FiTag className="mr-2" /> Category <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     name="category"
//                     value={formData.category}
//                     onChange={handleInputChange}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//                     required
//                   >
//                     <option value="Electronics">Electronics</option>
//                     <option value="Clothing">Clothing</option>
//                     <option value="Home">Home</option>
//                     <option value="Books">Books</option>
//                     <option value="Books">Grocery</option>
//                     {categories
//                       .filter(cat => !["Electronics", "Clothing", "Home", "Books", "Grocery"].includes(cat))
//                       .map((category) => (
//                         <option key={category} value={category}>
//                           {category}
//                         </option>
//                       ))}
//                   </select>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
//                     <FiFileText className="mr-2" /> Product Description <span className="text-red-500">*</span>
//                   </label>
//                   <textarea
//                     name="description"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     rows={4}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//                     placeholder="Enter product description"
//                     required
//                   />
//                 </div>
                
//                 <div className="grid grid-cols-3 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
//                       <FiDollarSign className="mr-2" /> Original Price (₹) <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       name="originalPrice"
//                       value={formData.originalPrice}
//                       onChange={handleInputChange}
//                       min="0"
//                       step="0.01"
//                       className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//                       placeholder="0.00"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
//                       <FiDollarSign className="mr-2" /> Selling Price ($) <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       name="price"
//                       value={formData.price}
//                       onChange={handleInputChange}
//                       min="0"
//                       step="0.01"
//                       className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//                       placeholder="0.00"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
//                       <FiPercent className="mr-2" /> Discount (%)
//                     </label>
//                     <div className="relative">
//                       <input
//                         type="number"
//                         value={discount}
//                         readOnly
//                         className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-600"
//                       />
//                       <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
//                         <FiPercent />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
//                     <FiImage className="mr-2" /> Product Images (Max 5) <span className="text-red-500">*</span>
//                   </label>
//                   <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition">
//                     <input
//                       type="file"
//                       multiple
//                       accept="image/*"
//                       onChange={handleImageUpload}
//                       className="hidden"
//                       id="image-upload"
//                       required={!editingProductId && formData.images.length === 0}
//                     />
//                     <label htmlFor="image-upload" className="cursor-pointer">
//                       <FiImage className="mx-auto h-12 w-12 text-gray-400" />
//                       <p className="mt-2 text-sm text-gray-600">
//                         <span className="font-medium text-blue-600 hover:text-blue-500">Click to upload</span> or drag and drop
//                       </p>
//                       <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5 files</p>
//                     </label>
//                   </div>
//                   {formData.images.length > 0 && (
//                     <div className="mt-4 grid grid-cols-3 gap-2">
//                       {Array.from(formData.images).map((file, index) => (
//                         <div key={index} className="bg-gray-100 rounded-lg p-2 text-sm text-gray-600 truncate">
//                           {file.name}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="flex space-x-3 pt-2">
//                   <button
//                     type="submit"
//                     className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center"
//                     disabled={isLoading}
//                   >
//                     {isLoading ? (
//                       <>
//                         <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         Processing...
//                       </>
//                     ) : editingProductId ? (
//                       <>
//                         <FiSave className="mr-2" /> Update Product
//                       </>
//                     ) : (
//                       <>
//                         <FiPlus className="mr-2" /> Add Product
//                       </>
//                     )}
//                   </button>
                  
//                   {editingProductId && (
//                     <button
//                       type="button"
//                       className="bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-semibold hover:bg-gray-300 transition flex items-center justify-center"
//                       onClick={() => {
//                         setEditingProductId(null);
//                         setFormData({
//                           name: "",
//                           description: "",
//                           originalPrice: "",
//                           price: "",
//                           discount: 0,
//                           category: "Electronics",
//                           images: [],
//                         });
//                       }}
//                     >
//                       <FiX className="mr-2" /> Cancel
//                     </button>
//                   )}
//                 </div>
//               </form>
//             </div>
            
//             {/* Right: View Products Section */}
//             <div className="w-full lg:w-3/5 p-8">
//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//                 <div className="flex items-center">
//                   <div className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
//                     <FiPackage size={20} />
//                   </div>
//                   <h2 className="text-2xl font-bold text-gray-800">Product List</h2>
//                   <span className="ml-3 bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
//                     {products.length} items
//                   </span>
//                 </div>
                
//                 <div className="flex flex-wrap gap-3 w-full sm:w-auto">
//                   <div className="relative flex-1 min-w-[200px]">
//                     <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                       <FiSearch className="text-gray-400" />
//                     </div>
//                     <input
//                       type="text"
//                       placeholder="Search products..."
//                       className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                     />
//                   </div>
                  
//                   <div className="flex gap-2">
//                     <button
//                       className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50 transition flex items-center"
//                       onClick={deleteSelected}
//                       disabled={!products.some((p) => p.selected) || isLoading}
//                     >
//                       <FiTrash2 className="mr-2" />
//                       <span className="hidden sm:inline">Delete Selected</span>
//                     </button>
                    
//                     <div className="relative">
//                       <select
//                         value={filter}
//                         onChange={(e) => {
//                           setFilter(e.target.value);
//                           setCurrentPage(1);
//                         }}
//                         className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       >
//                         <option value="All">All Categories</option>
//                         {categories.map((category) => (
//                           <option key={category} value={category}>
//                             {category}
//                           </option>
//                         ))}
//                       </select>
//                       <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                         <FiFilter />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               {/* View Mode Toggle */}
//               <div className="flex justify-end mb-4">
//                 <div className="inline-flex rounded-md shadow-sm" role="group">
//                   <button
//                     type="button"
//                     className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
//                       viewMode === 'table'
//                         ? 'bg-blue-600 text-white'
//                         : 'bg-white text-gray-700 hover:bg-gray-100'
//                     }`}
//                     onClick={() => setViewMode('table')}
//                   >
//                     <FiList className="inline mr-2" /> Table View
//                   </button>
//                   <button
//                     type="button"
//                     className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
//                       viewMode === 'grid'
//                         ? 'bg-blue-600 text-white'
//                         : 'bg-white text-gray-700 hover:bg-gray-100'
//                     }`}
//                     onClick={() => setViewMode('grid')}
//                   >
//                     <FiGrid className="inline mr-2" /> Grid View
//                   </button>
//                 </div>
//               </div>
              
//               {/* Product List - Table View (default for large catalogs) */}
//               {viewMode === 'table' && (
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
//                           <input
//                             type="checkbox"
//                             className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
//                             checked={currentProducts.length > 0 && currentProducts.every(product => product.selected)}
//                             onChange={toggleSelectAll}
//                           />
//                         </th>
//                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Product
//                         </th>
//                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Category
//                         </th>
//                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Price
//                         </th>
//                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Discount
//                         </th>
//                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Images
//                         </th>
//                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Actions
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {currentProducts.length === 0 ? (
//                         <tr>
//                           <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
//                             {searchQuery || filter !== "All" 
//                               ? "No products match your search criteria" 
//                               : "No products found"}
//                           </td>
//                         </tr>
//                       ) : (
//                         currentProducts.map((product) => (
//                           <tr key={product._id} className="hover:bg-gray-50">
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <input
//                                 type="checkbox"
//                                 className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
//                                 checked={product.selected}
//                                 onChange={() => toggleSelect(product._id)}
//                               />
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <div className="text-sm font-medium text-gray-900">{product.name}</div>
//                               <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <div className="text-sm text-gray-900">{product.category}</div>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <div className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</div>
//                               {product.originalPrice > product.price && (
//                                 <div className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</div>
//                               )}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               {product.discount > 0 ? (
//                                 <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                                   {product.discount}% off
//                                 </span>
//                               ) : (
//                                 <span className="text-sm text-gray-500">No discount</span>
//                               )}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <div className="flex space-x-1">
//                                 {product.images.slice(0, 3).map((img, index) => (
//                                   <img
//                                     key={index}
//                                     src={`http://localhost:5000${img}`}
//                                     alt={product.name}
//                                     className="h-8 w-8 rounded object-cover"
//                                     onError={(e) => {
//                                       (e.target as HTMLImageElement).src = "/placeholder-product.jpg";
//                                     }}
//                                   />
//                                 ))}
//                                 {product.images.length > 3 && (
//                                   <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-500">
//                                     +{product.images.length - 3}
//                                   </div>
//                                 )}
//                               </div>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                               <button
//                                 className="text-blue-600 hover:text-blue-900 mr-3"
//                                 onClick={() => {
//                                   setFormData({
//                                     name: product.name,
//                                     description: product.description,
//                                     originalPrice: product.originalPrice.toString(),
//                                     price: product.price.toString(),
//                                     discount: product.discount,
//                                     category: product.category,
//                                     images: [],
//                                   });
//                                   setEditingProductId(product._id);
//                                   window.scrollTo({ top: 0, behavior: 'smooth' });
//                                 }}
//                                 disabled={isLoading}
//                               >
//                                 <FiEdit2 />
//                               </button>
//                               <button
//                                 className="text-red-600 hover:text-red-900"
//                                 onClick={() => deleteProduct(product._id)}
//                                 disabled={isLoading}
//                               >
//                                 <FiTrash2 />
//                               </button>
//                             </td>
//                           </tr>
//                         ))
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
              
//               {/* Product List - Grid View */}
//               {viewMode === 'grid' && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {currentProducts.length === 0 ? (
//                     <div className="col-span-2 text-center py-12">
//                       <div className="text-gray-400 mb-4">
//                         <FiPackage size={48} className="mx-auto" />
//                       </div>
//                       <div className="text-gray-500">
//                         {searchQuery || filter !== "All" 
//                           ? "No products match your search criteria" 
//                           : "No products found"}
//                       </div>
//                     </div>
//                   ) : (
//                     currentProducts.map((product) => (
//                       <div
//                         key={product._id}
//                         className="p-4 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
//                       >
//                         <div className="flex items-start">
//                           <input
//                             type="checkbox"
//                             checked={product.selected}
//                             onChange={() => toggleSelect(product._id)}
//                             className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
//                           />
//                           <div className="ml-4 flex-1">
//                             <div className="flex justify-between items-start">
//                               <div>
//                                 <div className="font-bold text-gray-900 text-lg">
//                                   {product.name}
//                                 </div>
//                                 <div className="text-gray-500 text-sm font-medium mt-1">
//                                   {product.category}
//                                 </div>
//                               </div>
//                               <div className="text-right">
//                                 <div className="text-gray-900 font-bold text-lg">
//                                   ${product.price.toFixed(2)}
//                                 </div>
//                                 {product.originalPrice > product.price && (
//                                   <div className="text-gray-500 text-sm line-through">
//                                     ${product.originalPrice.toFixed(2)}
//                                   </div>
//                                 )}
//                                 {product.discount > 0 && (
//                                   <div className="text-green-600 text-sm font-medium mt-1">
//                                     {product.discount}% off
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
                            
//                             <div className="text-gray-600 text-sm mt-3 line-clamp-2">
//                               {product.description}
//                             </div>
                            
//                             {/* Images */}
//                             {product.images.length > 0 && (
//                               <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
//                                 {product.images.slice(0, 3).map((img, index) => (
//                                   <img
//                                     key={index}
//                                     src={`http://localhost:5000${img}`}
//                                     alt={product.name}
//                                     className="w-16 h-16 object-cover rounded border border-gray-200 flex-shrink-0"
//                                     onError={(e) => {
//                                       (e.target as HTMLImageElement).src = "/placeholder-product.jpg";
//                                     }}
//                                   />
//                                 ))}
//                                 {product.images.length > 3 && (
//                                   <div className="w-16 h-16 rounded border border-gray-200 bg-gray-100 flex items-center justify-center text-gray-500 text-sm flex-shrink-0">
//                                     +{product.images.length - 3}
//                                   </div>
//                                 )}
//                               </div>
//                             )}
                            
//                             <div className="flex gap-3 mt-4">
//                               <button
//                                 className="text-blue-600 hover:text-blue-800 font-medium flex items-center text-sm"
//                                 onClick={() => {
//                                   setFormData({
//                                     name: product.name,
//                                     description: product.description,
//                                     originalPrice: product.originalPrice.toString(),
//                                     price: product.price.toString(),
//                                     discount: product.discount,
//                                     category: product.category,
//                                     images: [],
//                                   });
//                                   setEditingProductId(product._id);
//                                   window.scrollTo({ top: 0, behavior: 'smooth' });
//                                 }}
//                                 disabled={isLoading}
//                               >
//                                 <FiEdit2 className="mr-1" /> Edit
//                               </button>
//                               <button
//                                 className="text-red-600 hover:text-red-800 font-medium flex items-center text-sm"
//                                 onClick={() => deleteProduct(product._id)}
//                                 disabled={isLoading}
//                               >
//                                 <FiTrash2 className="mr-1" /> Delete
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               )}
              
//               {/* Pagination */}
//               {totalPages > 1 && (
//                 <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
//                   <div className="text-sm text-gray-500">
//                     Showing {indexOfFirstProduct + 1} to{" "}
//                     {Math.min(indexOfLastProduct, sortedProducts.length)} of{" "}
//                     {sortedProducts.length} products
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <button
//                       disabled={currentPage === 1 || isLoading}
//                       onClick={() => setCurrentPage(1)}
//                       className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-100 transition"
//                       title="First Page"
//                     >
//                       <FiChevronsLeft />
//                     </button>
//                     <button
//                       disabled={currentPage === 1 || isLoading}
//                       onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                       className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-100 transition"
//                       title="Previous Page"
//                     >
//                       <FiChevronLeft />
//                     </button>
                    
//                     <div className="flex gap-1">
//                       {getPageNumbers().map((page, index) => (
//                         typeof page === 'number' ? (
//                           <button
//                             key={index}
//                             className={`w-10 h-10 rounded-lg ${
//                               currentPage === page
//                                 ? "bg-blue-500 text-white"
//                                 : "border border-gray-300 hover:bg-gray-100"
//                             }`}
//                             onClick={() => setCurrentPage(page)}
//                             disabled={isLoading}
//                           >
//                             {page}
//                           </button>
//                         ) : (
//                           <span key={index} className="flex items-center px-2">
//                             {page}
//                           </span>
//                         )
//                       ))}
//                     </div>
                    
//                     <button
//                       disabled={currentPage === totalPages || isLoading}
//                       onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//                       className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-100 transition"
//                       title="Next Page"
//                     >
//                       <FiChevronRight />
//                     </button>
//                     <button
//                       disabled={currentPage === totalPages || isLoading}
//                       onClick={() => setCurrentPage(totalPages)}
//                       className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-100 transition"
//                       title="Last Page"
//                     >
//                       <FiChevronsRight />
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default EcommercePage;