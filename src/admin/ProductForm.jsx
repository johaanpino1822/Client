import React, { useState } from 'react';
import axios from 'axios';
import { FiUpload, FiStar, FiSave, FiLoader, FiCpu, FiHardDrive, FiPrinter, FiMonitor } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    brand: '',
    model: '',
    warranty: '12',
    featured: false,
    specifications: {
      processor: '',
      ram: '',
      storage: '',
      graphics: '',
      os: ''
    }
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'laptops', label: 'Laptops', icon: <FiCpu className="mr-2" /> },
    { value: 'desktops', label: 'Computadores de Escritorio', icon: <FiMonitor className="mr-2" /> },
    { value: 'components', label: 'Componentes', icon: <FiHardDrive className="mr-2" /> },
    { value: 'peripherals', label: 'Periféricos', icon: <FiPrinter className="mr-2" /> },
    { value: 'barcode', label: 'Lectores de Código de Barras', icon: <FiPrinter className="mr-2" /> },
    { value: 'servers', label: 'Servidores', icon: <FiHardDrive className="mr-2" /> },
    { value: 'networking', label: 'Redes y Conectividad', icon: <FiCpu className="mr-2" /> },
    { value: 'storage', label: 'Almacenamiento', icon: <FiHardDrive className="mr-2" /> }
  ];

  const brands = [
    'HP', 'Dell', 'Lenovo', 'Asus', 'Acer', 'Apple', 'Microsoft', 
    'Samsung', 'Toshiba', 'MSI', 'Huawei', 'Xiaomi', 'Logitech',
    'Epson', 'Canon', 'Zebra', 'Honeywell', 'Datalogic'
  ];

  const operatingSystems = [
    'Windows 10', 'Windows 11', 'macOS', 'Linux', 'Chrome OS', 'Sin sistema operativo'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('specifications.')) {
      const specName = name.split('.')[1];
      setFormData({
        ...formData,
        specifications: {
          ...formData.specifications,
          [specName]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nombre es requerido';
    if (!formData.description.trim()) newErrors.description = 'Descripción es requerida';
    if (!formData.price || isNaN(formData.price) || formData.price <= 0) 
      newErrors.price = 'Precio debe ser mayor a 0';
    if (!formData.stock || isNaN(formData.stock) || formData.stock < 0) 
      newErrors.stock = 'Stock no puede ser negativo';
    if (!formData.category) newErrors.category = 'Categoría es requerida';
    if (!formData.brand) newErrors.brand = 'Marca es requerida';
    if (!formData.model) newErrors.model = 'Modelo es requerido';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'specifications') {
          data.append(key, JSON.stringify(value));
        } else {
          data.append(key, value);
        }
      });
      if (imageFile) {
        data.append('image', imageFile);
      }

      const response = await axios.post('/api/products', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Producto creado exitosamente', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        className: "border-l-4 border-green-500 bg-white shadow-lg"
      });

      onSubmit(response.data);
    } catch (err) {
      console.error(err);
      toast.error('Error al guardar el producto', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        className: "border-l-4 border-red-500 bg-white shadow-lg"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderSpecificationFields = () => {
    switch(formData.category) {
      case 'laptops':
      case 'desktops':
      case 'servers':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0C4B45] mb-1">Procesador</label>
              <input
                type="text"
                name="specifications.processor"
                value={formData.specifications.processor}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#662D8F] focus:border-transparent"
                placeholder="Ej: Intel Core i7-10700K"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0C4B45] mb-1">Memoria RAM</label>
              <input
                type="text"
                name="specifications.ram"
                value={formData.specifications.ram}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#662D8F] focus:border-transparent"
                placeholder="Ej: 16GB DDR4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0C4B45] mb-1">Almacenamiento</label>
              <input
                type="text"
                name="specifications.storage"
                value={formData.specifications.storage}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#662D8F] focus:border-transparent"
                placeholder="Ej: 512GB SSD + 1TB HDD"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0C4B45] mb-1">Tarjeta Gráfica</label>
              <input
                type="text"
                name="specifications.graphics"
                value={formData.specifications.graphics}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#662D8F] focus:border-transparent"
                placeholder="Ej: NVIDIA GeForce RTX 3060"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-[#0C4B45] mb-1">Sistema Operativo</label>
              <select
                name="specifications.os"
                value={formData.specifications.os}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#662D8F] focus:border-transparent"
              >
                <option value="">Seleccione un sistema operativo</option>
                {operatingSystems.map(os => (
                  <option key={os} value={os}>{os}</option>
                ))}
              </select>
            </div>
          </div>
        );
      case 'barcode':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0C4B45] mb-1">Tipo de Escáner</label>
              <input
                type="text"
                name="specifications.scannerType"
                value={formData.specifications.scannerType}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#662D8F] focus:border-transparent"
                placeholder="Ej: Láser, CCD, Imager"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0C4B45] mb-1">Conectividad</label>
              <input
                type="text"
                name="specifications.connectivity"
                value={formData.specifications.connectivity}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#662D8F] focus:border-transparent"
                placeholder="Ej: USB, Bluetooth, WiFi"
              />
            </div>
          </div>
        );
      default:
        return (
          <div>
            <label className="block text-sm font-medium text-[#0C4B45] mb-1">Especificaciones Técnicas</label>
            <textarea
              name="specifications.general"
              value={formData.specifications.general}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#662D8F] focus:border-transparent"
              placeholder="Ingrese las especificaciones técnicas del producto..."
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0C4B45]/5 to-white p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-[#0C4B45] mb-6">Nuevo Producto Tecnológico</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Columna Izquierda */}
              <div className="space-y-6">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-[#0C4B45] mb-1">Nombre del Producto *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#662D8F] focus:border-transparent`}
                    placeholder="Ej: Laptop HP EliteBook 840 G8"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                {/* Marca y Modelo */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0C4B45] mb-1">Marca *</label>
                    <select
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.brand ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#662D8F] focus:border-transparent`}
                    >
                      <option value="">Seleccione una marca</option>
                      {brands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                    {errors.brand && <p className="mt-1 text-sm text-red-600">{errors.brand}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0C4B45] mb-1">Modelo *</label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.model ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#662D8F] focus:border-transparent`}
                      placeholder="Número de modelo"
                    />
                    {errors.model && <p className="mt-1 text-sm text-red-600">{errors.model}</p>}
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-[#0C4B45] mb-1">Descripción *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#662D8F] focus:border-transparent`}
                    placeholder="Describe las características y beneficios del producto..."
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                </div>

                {/* Especificaciones Técnicas */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-[#0C4B45] mb-3">Especificaciones Técnicas</h3>
                  {renderSpecificationFields()}
                </div>
              </div>

              {/* Columna Derecha */}
              <div className="space-y-6">
                {/* Vista previa de imagen */}
                <div>
                  <label className="block text-sm font-medium text-[#0C4B45] mb-1">Imagen del Producto</label>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                    {imagePreview ? (
                      <div className="relative group">
                        <img 
                          src={imagePreview} 
                          alt="Vista previa" 
                          className="h-48 w-full object-contain rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                          <span className="text-white font-medium">Cambiar imagen</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <FiUpload className="mx-auto text-gray-400 text-3xl mb-2" />
                        <p className="text-sm text-gray-500">Arrastra una imagen o haz clic para seleccionar</p>
                      </div>
                    )}
                    <input
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                      id="image-upload"
                    />
                    <label 
                      htmlFor="image-upload"
                      className="mt-4 px-4 py-2 bg-[#0C4B45]/10 hover:bg-[#0C4B45]/20 text-[#0C4B45] rounded-lg transition-colors cursor-pointer"
                    >
                      Seleccionar Imagen
                    </label>
                  </div>
                </div>

                {/* Categoría */}
                <div>
                  <label className="block text-sm font-medium text-[#0C4B45] mb-1">Categoría *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.category ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#662D8F] focus:border-transparent`}
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                </div>

                {/* Precio, Stock y Garantía */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-[#0C4B45] mb-1">Precio *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className={`w-full pl-8 pr-4 py-3 rounded-lg border ${errors.price ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#662D8F] focus:border-transparent`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0C4B45] mb-1">Stock *</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      className={`w-full px-4 py-3 rounded-lg border ${errors.stock ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#662D8F] focus:border-transparent`}
                      placeholder="Cantidad"
                    />
                    {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0C4B45] mb-1">Garantía (meses)</label>
                  <select
                    name="warranty"
                    value={formData.warranty}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#662D8F] focus:border-transparent"
                  >
                    <option value="3">3 meses</option>
                    <option value="6">6 meses</option>
                    <option value="12">12 meses</option>
                    <option value="24">24 meses</option>
                    <option value="36">36 meses</option>
                  </select>
                </div>

                {/* Destacado */}
                <div className="flex items-center space-x-3 p-3 bg-[#F2A9FD]/10 rounded-lg border border-[#F2A9FD]/20">
                  <div className={`p-1 rounded-full ${formData.featured ? 'bg-[#662D8F] text-yellow-300' : 'bg-gray-200'}`}>
                    <FiStar className="text-lg" />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="featured" className="text-sm font-medium text-[#662D8F] cursor-pointer">
                      Producto Destacado
                    </label>
                    <p className="text-xs text-gray-500">Aparecerá en la sección principal</p>
                  </div>
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="h-5 w-5 text-[#662D8F] rounded focus:ring-[#662D8F]"
                  />
                </div>
              </div>
            </div>

            {/* Botón de envío */}
            <div className="pt-4">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center justify-center px-6 py-4 rounded-lg text-white font-medium transition-all ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-[#662D8F] to-[#512577] hover:from-[#512577] hover:to-[#662D8F] shadow-lg'
                }`}
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    Guardar Producto
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;