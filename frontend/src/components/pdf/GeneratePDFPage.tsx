
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { toast } from "@/hooks/use-toast";
// import { Hexagon, Download, ArrowLeft } from "lucide-react";

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   total: number;
//   gst: number;
// }

// const GeneratePDFPage = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [userEmail, setUserEmail] = useState("");
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [pdfGenerated, setPdfGenerated] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedProducts = localStorage.getItem("invoiceProducts");
//     const storedEmail = localStorage.getItem("userEmail");
    
//     if (storedProducts) {
//       setProducts(JSON.parse(storedProducts));
//     }
//     if (storedEmail) {
//       setUserEmail(storedEmail);
//     }
//   }, []);

//   const calculateTotals = () => {
//     const subTotal = products.reduce((sum, product) => sum + product.total, 0);
//     const totalGST = products.reduce((sum, product) => sum + product.gst, 0);
//     return { subTotal, totalGST, grandTotal: subTotal + totalGST };
//   };

//   const generatePDF = async () => {
//     setIsGenerating(true);
    
//     try {
//       // API call structure for PDF generation
//       const invoiceData = {
//         userEmail,
//         products,
//         totals: calculateTotals(),
//         date: new Date().toLocaleDateString(),
//         invoiceNumber: `INV-${Date.now()}`,
//       };

//       console.log("PDF generation API call would be made with:", invoiceData);

//       // Simulate API call
//       const response = await fetch('/api/generate-pdf', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
//         },
//         body: JSON.stringify(invoiceData),
//       });

//       if (response.ok) {
//         // Handle successful PDF generation
//         setPdfGenerated(true);
//         toast({
//           title: "PDF Generated Successfully",
//           description: "Your invoice PDF is ready for download",
//         });
//       } else {
//         throw new Error("PDF generation failed");
//       }
//     } catch (error) {
//       // For demo purposes, simulate successful PDF generation
//       setTimeout(() => {
//         setPdfGenerated(true);
//         toast({
//           title: "PDF Generated Successfully",
//           description: "Your invoice PDF is ready for download",
//         });
//       }, 2000);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const downloadPDF = () => {
//     // In a real implementation, this would download the actual PDF
//     const link = document.createElement('a');
//     link.href = '#'; // This would be the actual PDF URL from the API
//     link.download = `invoice-${Date.now()}.pdf`;
//     // link.click(); // Uncomment when actual PDF is available
    
//     toast({
//       title: "Download Started",
//       description: "PDF download would start here with actual API integration",
//     });
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("authToken");
//     localStorage.removeItem("userEmail");
//     localStorage.removeItem("invoiceProducts");
//     window.location.href = "/login";
//   };

//   const { subTotal, totalGST, grandTotal } = calculateTotals();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <div className="flex items-center space-x-4">
//           <Button
//             variant="ghost"
//             onClick={() => navigate("/add-products")}
//             className="text-white hover:text-green-400"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back
//           </Button>
//           <div className="flex items-center space-x-2">
//             <Hexagon className="h-8 w-8 text-green-400" />
//             <span className="text-2xl font-bold text-white">levitation</span>
//             <span className="text-sm text-gray-400">infotech</span>
//           </div>
//         </div>
//         <Button 
//           onClick={handleLogout}
//           variant="outline" 
//           className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
//         >
//           Logout
//         </Button>
//       </div>

//       <div className="max-w-4xl mx-auto space-y-6">
//         <div className="text-center space-y-2">
//           <h1 className="text-3xl font-bold text-white">Generate PDF Invoice</h1>
//           <p className="text-gray-400">Review your invoice details and generate PDF</p>
//         </div>

//         {/* Invoice Preview */}
//         <Card className="bg-white text-black shadow-2xl">
//           <CardHeader className="bg-slate-800 text-white">
//             <div className="flex justify-between items-center">
//               <div className="flex items-center space-x-2">
//                 <Hexagon className="h-6 w-6 text-green-400" />
//                 <span className="text-xl font-bold">Levitation</span>
//                 <span className="text-sm text-gray-300">infotech</span>
//               </div>
//               <div className="text-right">
//                 <CardTitle className="text-white">INVOICE GENERATOR</CardTitle>
//                 <p className="text-sm text-gray-300">Sample Output Should be like</p>
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent className="p-6">
//             <div className="space-y-6">
//               {/* Invoice Info */}
//               <div className="bg-slate-800 text-white p-4 rounded-lg">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-gray-300">Name</p>
//                     <p className="font-medium">Person_name</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-sm text-gray-300">Date: {new Date().toLocaleDateString()}</p>
//                     <p className="bg-white text-black px-3 py-1 rounded-full inline-block text-sm">
//                       {userEmail}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Products Table */}
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-slate-800 text-white">
//                     <tr>
//                       <th className="text-left p-3 rounded-l-lg">Product</th>
//                       <th className="text-center p-3">Qty</th>
//                       <th className="text-center p-3">Rate</th>
//                       <th className="text-right p-3 rounded-r-lg">Total Amount</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {products.map((product, index) => (
//                       <tr key={product.id} className="border-b">
//                         <td className="p-3">{product.name}</td>
//                         <td className="p-3 text-center">{product.quantity}</td>
//                         <td className="p-3 text-center">₹{product.price}</td>
//                         <td className="p-3 text-right">USD {product.total}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Totals */}
//               <div className="space-y-2 text-right">
//                 <div className="flex justify-end space-x-8">
//                   <span>Total Charges</span>
//                   <span>${subTotal.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-end space-x-8">
//                   <span>GST (18%)</span>
//                   <span>₹{totalGST.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-end space-x-8 text-lg font-bold text-blue-600 border-t pt-2">
//                   <span>Total Amount</span>
//                   <span>₹ {grandTotal.toFixed(2)}</span>
//                 </div>
//               </div>

//               <div className="text-xs text-gray-500 mt-8">
//                 <p>Date: {new Date().toLocaleDateString()}</p>
//               </div>

//               <div className="bg-slate-800 text-white p-4 rounded-lg text-center text-sm">
//                 We are pleased to provide any further information you may require and look forward to assisting with
//                 your next order. Rest assured, it will receive our prompt and dedicated attention.
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Generate/Download Buttons */}
//         <div className="text-center space-y-4">
//           {!pdfGenerated ? (
//             <Button 
//               onClick={generatePDF}
//               disabled={isGenerating}
//               className="bg-green-400 hover:bg-green-500 text-black font-medium px-8 py-3 text-lg"
//             >
//               {isGenerating ? "Generating PDF..." : "Generate PDF Invoice"}
//             </Button>
//           ) : (
//             <Button 
//               onClick={downloadPDF}
//               className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 text-lg"
//             >
//               <Download className="w-4 h-4 mr-2" />
//               Download PDF
//             </Button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GeneratePDFPage;

import React from "react";

const GeneratePDFPage = () => {
  const generateInvoiceHTML = (): string => {
    // Dynamically generate or fetch invoice HTML string
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
          </style>
        </head>
        <body>
          <h1>Invoice</h1>
          <p>This is a sample invoice for PDF generation.</p>
        </body>
      </html>
    `;
  };

  const handleGeneratePDF = async () => {
    try {
      const res = await fetch("http://localhost:4000/pdf/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ html: generateInvoiceHTML() }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate PDF");
      }

      // If backend returns PDF file as blob:
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "invoice.pdf";
      link.click();
    } catch (error) {
      console.error("PDF generation error:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Invoice PDF Generator</h2>
      <button
        onClick={handleGeneratePDF}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Generate PDF
      </button>
    </div>
  );
};

export default GeneratePDFPage;
