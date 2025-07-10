
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Hexagon, Plus, Trash2, AlertCircle } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  gst: number;
}

interface ValidationError {
  field: string;
  message: string;
}

const AddProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "", price: 0, quantity: 0, total: 0, gst: 0 }
  ]);
  const [currentProduct, setCurrentProduct] = useState({
    name: "",
    price: 0,
    quantity: 0
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string>("");
  const navigate = useNavigate();

  const validateCurrentProduct = (): ValidationError[] => {
    const validationErrors: ValidationError[] = [];

    if (!currentProduct.name.trim()) {
      validationErrors.push({ field: "name", message: "Product name is required" });
    } else if (currentProduct.name.length < 2) {
      validationErrors.push({ field: "name", message: "Product name must be at least 2 characters" });
    }

    if (currentProduct.price <= 0) {
      validationErrors.push({ field: "price", message: "Price must be greater than 0" });
    } else if (currentProduct.price > 999999) {
      validationErrors.push({ field: "price", message: "Price cannot exceed 999,999" });
    }

    if (currentProduct.quantity <= 0) {
      validationErrors.push({ field: "quantity", message: "Quantity must be greater than 0" });
    } else if (currentProduct.quantity > 10000) {
      validationErrors.push({ field: "quantity", message: "Quantity cannot exceed 10,000" });
    }

    return validationErrors;
  };

  const calculateProductTotals = (price: number, quantity: number) => {
    try {
      const total = price * quantity;
      const gst = total * 0.18; // 18% GST
      return { total, gst };
    } catch (error) {
      console.error("Error calculating product totals:", error);
      throw new Error("Failed to calculate product totals");
    }
  };

  const handleCurrentProductChange = (field: string, value: string | number) => {
    try {
      setErrors(prev => prev.filter(err => err.field !== field));
      setGeneralError("");
      
      const updatedProduct = { ...currentProduct, [field]: value };
      setCurrentProduct(updatedProduct);
    } catch (error) {
      console.error("Error updating product field:", error);
      setGeneralError("Failed to update product information");
    }
  };

  const addProduct = async () => {
    try {
      setIsLoading(true);
      setGeneralError("");
      
      const validationErrors = validateCurrentProduct();
      
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        toast({
          title: "Validation Error",
          description: "Please fix the errors before adding the product",
          variant: "destructive",
        });
        return;
      }

      // Check for duplicate product names
      const existingProduct = products.find(
        p => p.name.toLowerCase().trim() === currentProduct.name.toLowerCase().trim() && p.name
      );
      
      if (existingProduct) {
        setErrors([{ field: "name", message: "A product with this name already exists" }]);
        toast({
          title: "Duplicate Product",
          description: "A product with this name already exists",
          variant: "destructive",
        });
        return;
      }

      const { total, gst } = calculateProductTotals(currentProduct.price, currentProduct.quantity);
      const newProduct: Product = {
        id: Date.now().toString(),
        name: currentProduct.name.trim(),
        price: currentProduct.price,
        quantity: currentProduct.quantity,
        total,
        gst
      };

      setProducts(prevProducts => [...prevProducts, newProduct]);
      setCurrentProduct({ name: "", price: 0, quantity: 0 });
      setErrors([]);
      
      toast({
        title: "Product Added",
        description: "Product has been added successfully",
      });
    } catch (error) {
      console.error("Error adding product:", error);
      setGeneralError("Failed to add product. Please try again.");
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeProduct = (id: string) => {
    try {
      if (products.length > 1) {
        setProducts(products.filter(product => product.id !== id));
        toast({
          title: "Product Removed",
          description: "Product has been removed successfully",
        });
      } else {
        toast({
          title: "Cannot Remove",
          description: "At least one product row must remain",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error removing product:", error);
      toast({
        title: "Error",
        description: "Failed to remove product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const calculateGrandTotal = () => {
    try {
      const subTotal = products.reduce((sum, product) => sum + product.total, 0);
      const totalGST = products.reduce((sum, product) => sum + product.gst, 0);
      return { subTotal, totalGST, grandTotal: subTotal + totalGST };
    } catch (error) {
      console.error("Error calculating grand total:", error);
      return { subTotal: 0, totalGST: 0, grandTotal: 0 };
    }
  };

  const handleNext = async () => {
    try {
      setIsLoading(true);
      setGeneralError("");

      const validProducts = products.filter(p => p.name.trim());
      
      if (validProducts.length === 0) {
        toast({
          title: "No Products",
          description: "Please add at least one product before proceeding",
          variant: "destructive",
        });
        return;
      }

      // Validate all products have valid data
      const hasInvalidProducts = validProducts.some(p => 
        !p.name.trim() || p.price <= 0 || p.quantity <= 0
      );

      if (hasInvalidProducts) {
        toast({
          title: "Invalid Products",
          description: "Please ensure all products have valid name, price, and quantity",
          variant: "destructive",
        });
        return;
      }

      // Store products in localStorage with error handling
      try {
        localStorage.setItem("invoiceProducts", JSON.stringify(validProducts));
      } catch (storageError) {
        console.error("LocalStorage error:", storageError);
        throw new Error("Failed to save products. Your browser storage might be full.");
      }

      navigate("/generate-pdf");
    } catch (error) {
      console.error("Error proceeding to PDF generation:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to proceed to PDF generation";
      setGeneralError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("invoiceProducts");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error during logout:", error);
      // Force navigation even if localStorage fails
      window.location.href = "/login";
    }
  };

  const getFieldError = (field: string) => {
    return errors.find(err => err.field === field)?.message;
  };

  const { subTotal, totalGST, grandTotal } = calculateGrandTotal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <Hexagon className="h-6 w-6 text-green-400" />
          <span className="text-xl font-bold text-white">levitation</span>
          <span className="text-xs text-gray-400">infotech</span>
        </div>
        <Button 
          onClick={handleLogout}
          className="bg-green-400 hover:bg-green-500 text-black font-medium px-6"
          disabled={isLoading}
        >
          Logout
        </Button>
      </header>

      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">Add Products</h1>
            <p className="text-gray-400">This is basic login page which is used for levitation assignment purpose.</p>
          </div>

          {/* General Error Alert */}
          {generalError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{generalError}</AlertDescription>
            </Alert>
          )}

          {/* Product Input Form */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <Label className="text-white font-medium">Product Name</Label>
                <Input
                  placeholder="Enter the product name"
                  className={`bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 ${
                    getFieldError("name") ? "border-red-500" : ""
                  }`}
                  value={currentProduct.name}
                  onChange={(e) => handleCurrentProductChange('name', e.target.value)}
                  disabled={isLoading}
                />
                {getFieldError("name") && (
                  <p className="text-red-400 text-sm">{getFieldError("name")}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-white font-medium">Product Price</Label>
                <Input
                  type="number"
                  min="0"
                  max="999999"
                  step="0.01"
                  placeholder="Enter the price"
                  className={`bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 ${
                    getFieldError("price") ? "border-red-500" : ""
                  }`}
                  value={currentProduct.price || ""}
                  onChange={(e) => handleCurrentProductChange('price', Number(e.target.value))}
                  disabled={isLoading}
                />
                {getFieldError("price") && (
                  <p className="text-red-400 text-sm">{getFieldError("price")}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-white font-medium">Quantity</Label>
                <Input
                  type="number"
                  min="0"
                  max="10000"
                  placeholder="Enter the Qty"
                  className={`bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 ${
                    getFieldError("quantity") ? "border-red-500" : ""
                  }`}
                  value={currentProduct.quantity || ""}
                  onChange={(e) => handleCurrentProductChange('quantity', Number(e.target.value))}
                  disabled={isLoading}
                />
                {getFieldError("quantity") && (
                  <p className="text-red-400 text-sm">{getFieldError("quantity")}</p>
                )}
              </div>
              <Button 
                onClick={addProduct}
                className="bg-green-400 hover:bg-green-500 text-black font-medium"
                disabled={isLoading}
              >
                <Plus className="w-4 h-4 mr-2" />
                {isLoading ? "Adding..." : "Add Product"}
              </Button>
            </div>
          </div>

          {/* Products Table */}
          {products.length > 0 && products.some(p => p.name) && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700">
                    <tr>
                      <th className="text-left p-4 text-white font-medium">Product name</th>
                      <th className="text-left p-4 text-white font-medium">Qty</th>
                      <th className="text-left p-4 text-white font-medium">Rate</th>
                      <th className="text-left p-4 text-white font-medium">Total</th>
                      <th className="text-left p-4 text-white font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.filter(p => p.name).map((product, index) => (
                      <tr key={product.id} className={index % 2 === 0 ? "bg-slate-800/30" : "bg-slate-700/30"}>
                        <td className="p-4 text-white">{product.name}</td>
                        <td className="p-4 text-white">{product.quantity}</td>
                        <td className="p-4 text-white">INR {product.price.toFixed(2)}</td>
                        <td className="p-4 text-white">INR {product.total.toFixed(2)}</td>
                        <td className="p-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeProduct(product.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                            disabled={isLoading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {products.filter(p => p.name).length > 0 && (
                      <>
                        <tr className="bg-slate-700/50 border-t border-slate-600">
                          <td colSpan={3} className="p-4 text-right text-white font-medium">Sub-Total</td>
                          <td className="p-4 text-white font-medium">INR {subTotal.toFixed(2)}</td>
                          <td></td>
                        </tr>
                        <tr className="bg-slate-700/50">
                          <td colSpan={3} className="p-4 text-right text-white font-medium">incl + GST 18%</td>
                          <td className="p-4 text-white font-medium">INR {(subTotal + totalGST).toFixed(2)}</td>
                          <td></td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Generate PDF Button */}
          {products.some(p => p.name) && (
            <div className="text-center">
              <Button 
                onClick={handleNext}
                className="bg-green-400 hover:bg-green-500 text-black font-medium px-8 py-3 text-lg"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Generate PDF Invoice"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProductsPage;
